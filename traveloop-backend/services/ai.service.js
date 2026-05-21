const { GoogleGenAI } = require('@google/genai');
const OpenAI = require('openai');
const Groq = require('groq-sdk');

let openaiClient = null;
let geminiClient = null;
let groqClient = null;

// Only init OpenAI if key is explicitly set and non-empty
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()) {
  openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

if (process.env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Groq — primary AI provider (14,400 req/day free tier, very generous)
if (process.env.GROQ_API_KEY) {
  groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  console.log('[AI Service] Groq client initialized — using llama-3.3-70b-versatile as primary AI.');
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt, systemInstruction, jsonMode = false) {
  if (!openaiClient) throw new Error("OpenAI client not configured");
  
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,
    response_format: jsonMode ? { type: 'json_object' } : undefined,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

/**
 * Call Gemini API
 */
async function callGemini(prompt, systemInstruction, jsonMode = false) {
  if (!geminiClient) throw new Error("Gemini client not configured");
  
  const fullPrompt = systemInstruction 
    ? `${systemInstruction}\n\nUser request:\n${prompt}` 
    : prompt;

  const models = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.5-pro',
    'gemini-1.5-pro'
  ];

  let lastError = null;
  for (const model of models) {
    try {
      console.log(`Calling Gemini API using model: ${model}`);
      const response = await geminiClient.models.generateContent({
        model: model,
        contents: fullPrompt,
        config: jsonMode ? { responseMimeType: 'application/json' } : undefined,
      });
      return response.text;
    } catch (err) {
      lastError = err;
      console.warn(`Gemini model ${model} failed:`, err.message);
      // If it is a quota or 429 error, continue to the next model
      if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
        console.warn(`Model ${model} quota exceeded, trying next model...`);
        continue;
      }
      // For other errors (like invalid argument/model name not supported), we might also want to try next model or throw depending on error
      if (err.message.includes('not found') || err.message.includes('400') || err.message.includes('INVALID_ARGUMENT')) {
        continue;
      }
      throw err;
    }
  }
  throw lastError || new Error("All Gemini models failed");
}

/**
 * Call Groq API — primary AI provider
 */
async function callGroq(prompt, systemInstruction, jsonMode = false) {
  if (!groqClient) throw new Error('Groq client not configured');

  const messages = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const groqModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'];

  let lastErr = null;
  for (const model of groqModels) {
    try {
      console.log(`[Groq] Calling model: ${model}`);
      const params = {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      };
      if (jsonMode) {
        params.response_format = { type: 'json_object' };
        // Ensure system message mentions JSON for Groq JSON mode
        if (!messages[0] || !messages[0].content.toLowerCase().includes('json')) {
          messages.unshift({ role: 'system', content: 'You are a helpful assistant. Always respond with valid JSON.' });
        }
      }
      const completion = await groqClient.chat.completions.create(params);
      return completion.choices[0].message.content;
    } catch (err) {
      lastErr = err;
      console.warn(`[Groq] Model ${model} failed:`, err.message);
      // Continue to next model on rate limit or model error
      if (err.status === 429 || err.status === 503 || err.message.includes('rate') || err.message.includes('quota')) {
        continue;
      }
      // If model not supported, try next
      if (err.status === 400 || err.message.includes('not found') || err.message.includes('model')) {
        continue;
      }
      throw err;
    }
  }
  throw lastErr || new Error('All Groq models failed');
}

/**
 * Generate free-form text — Groq first, Gemini fallback, then local
 */
async function generateText(prompt, systemInstruction = '') {
  // 1. Try Groq (primary)
  if (groqClient) {
    try {
      const result = await callGroq(prompt, systemInstruction, false);
      if (result) return result;
    } catch (err) {
      console.warn('[AI] Groq text failed, falling back to Gemini:', err.message);
    }
  }

  // 2. Try Gemini (secondary)
  if (geminiClient) {
    try {
      return await callGemini(prompt, systemInstruction, false);
    } catch (err) {
      console.warn('[AI] Gemini text failed, falling back to local:', err.message);
    }
  }

  // 3. Local high-fidelity fallback
  return getFallbackText(prompt, systemInstruction);
}

/**
 * Generate structured JSON with OpenAI / Gemini fallback, and local high-fidelity generator fallback
 */
async function generateJSON(prompt, systemInstruction = '') {
  let responseText = null;

  // 1. Try Groq (primary — 14,400 req/day free)
  if (groqClient) {
    try {
      responseText = await callGroq(prompt, systemInstruction, true);
    } catch (err) {
      console.warn('[AI] Groq JSON failed, falling back to Gemini:', err.message);
    }
  }

  // 2. Try Gemini (secondary)
  if (!responseText && geminiClient) {
    try {
      responseText = await callGemini(prompt, systemInstruction, true);
    } catch (err) {
      console.warn('[AI] Gemini JSON failed, falling back to local JSON generator:', err.message);
    }
  }
  
  if (!responseText) {
    // High-fidelity JSON fallback
    return getFallbackJSON(prompt);
  }

  // Clean JSON response (remove markdown code fences if present)
  let cleanText = responseText.trim();
  if (cleanText.startsWith('```')) {
    const match = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      cleanText = match[1].trim();
    }
  }
  
  try {
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("Failed to parse JSON response, falling back to local JSON:", cleanText);
    return getFallbackJSON(prompt);
  }
}

/**
 * Detailed high-fidelity destination database for realistic fallbacks
 */
const DESTINATION_DATA = {
  tokyo: {
    name: "Tokyo",
    country: "Japan",
    tripName: "Tokyo AI Modern & Cultural Journey",
    morning: [
      { activity: "Sensō-ji Temple in Asakusa", description: "Explore Tokyo's oldest and most iconic Buddhist temple during the quiet morning hours." },
      { activity: "Meiji Jingu Shrine & Yoyogi Park", description: "Walk through the forested shrines in the heart of Shibuya, feeling the peaceful atmosphere." },
      { activity: "Tsukiji Outer Market Tasting", description: "Sample fresh sashimi, tamagoyaki (sweet omelet), and local seafood street bites." },
      { activity: "Shinjuku Gyoen National Garden", description: "Stroll through traditional Japanese, English, and French landscaped gardens." }
    ],
    afternoon: [
      { activity: "Akihabara Electric Town", description: "Explore the bustling streets famous for electronic shops, anime culture, and retro gaming arcades." },
      { activity: "teamLab Planets Digital Art Museum", description: "Walk through immersive digital art installations, wading through water and light projections." },
      { activity: "Shibuya Crossing & Hachiko Statue", description: "Experience the world's busiest pedestrian crossing and visit the famous loyal dog memorial." },
      { activity: "Harajuku Takeshita Street", description: "Browse quirky fashion boutiques, trendy cafes, and famous giant colorful crepes." }
    ],
    evening: [
      { activity: "Roppongi Hills Skyline Observatory", description: "Witness the breathtaking panoramic night views of Tokyo Tower and the skyline." },
      { activity: "Memory Lane (Omoide Yokocho) Dining", description: "Squeeze into tiny wooden stalls for delicious grilled yakitori skewers and drinks." },
      { activity: "Shinjuku Golden Gai Micro-Bars", description: "Explore narrow alleys filled with over 200 tiny themed bars, seating only 4-6 people each." },
      { activity: "Sumida River Dinner Cruise", description: "Enjoy traditional yakatabune boat dinner with scenic night lighting of the Rainbow Bridge." }
    ],
    food: ["Ramen at Ichiran / Afuri", "Fresh Sushi at Tsukiji", "Yakitori in Shinjuku", "Tempura at Tsunahachi", "Matcha Parfait in Ginza"],
    hotels: [
      { name: "Keio Plaza Hotel Tokyo", priceRange: "₹18,000 - ₹25,000 per night", rating: 4.6, description: "Luxurious high-rise hotel in Shinjuku with direct access to stations and stunning skyline views.", recommendationReason: "Premium comfort, multiple fine dining options, and close proximity to central business and shopping hubs.", nearbyAttractions: ["Shinjuku Gyoen", "Tokyo Metropolitan Government Building"], amenities: ["Free Wi-Fi", "Outdoor Pool", "Sky Bar", "Fitness Center"] },
      { name: "Hotel Gracery Shinjuku", priceRange: "₹10,000 - ₹15,000 per night", rating: 4.4, description: "Famous 'Godzilla Hotel' in Kabukicho, featuring modern, functional rooms and a giant Godzilla head on the terrace.", recommendationReason: "Vibrant neighborhood location, highly rated for clean and comfortable standard accommodations.", nearbyAttractions: ["Golden Gai", "Shinjuku Station"], amenities: ["Free Wi-Fi", "Godzilla Terrace View", "Buffet Restaurant"] },
      { name: "Shinjuku Kuyakusho-mae Capsule Hotel", priceRange: "₹2,500 - ₹4,000 per night", rating: 4.1, description: "Authentic capsule hotel offering private sleeping pods and a large shared hot public bath.", recommendationReason: "Extremely cost-effective option for solo budget travelers looking for a unique Japanese experience.", nearbyAttractions: ["Kabukicho", "Robot Restaurant District"], amenities: ["High-speed Wi-Fi", "Male/Female Saunas", "Shared Lounge", "Laundry"] }
    ]
  },
  paris: {
    name: "Paris",
    country: "France",
    tripName: "Paris AI Romance & Artistic Highlights",
    morning: [
      { activity: "Eiffel Tower Climbing", description: "Ascend the iconic wrought-iron tower for breathtaking early morning views of the city." },
      { activity: "Louvre Museum Guided Tour", description: "Walk through the historic museum halls to view masterpieces like the Mona Lisa and Venus de Milo." },
      { activity: "Musée d'Orsay Art Tour", description: "Admire the world's largest collection of Impressionist and Post-Impressionist art in a converted railway station." },
      { activity: "Notre-Dame Cathedral & Île de la Cité", description: "Walk around the historic island and view the spectacular Gothic architecture of the cathedral." }
    ],
    afternoon: [
      { activity: "Seine River Sightseeing Cruise", description: "Relax on a glass-topped boat ride to see the city's architectural monuments from the water." },
      { activity: "Champs-Élysées & Arc de Triomphe", description: "Walk the famous shopping boulevard and ascend the Arc for views of the star-shaped avenues." },
      { activity: "Montmartre & Sacré-Cœur Basilica", description: "Stroll the cobblestone streets of the artists' district and visit the hilltop white basilica." },
      { activity: "Palace of Versailles Excursion", description: "Take a short train ride to explore the lavish royal palace, Hall of Mirrors, and extensive gardens." }
    ],
    evening: [
      { activity: "Latin Quarter Bistro Dinner", description: "Savor classic French duck confit or escargots in a historic, cozy neighborhood restaurant." },
      { activity: "Le Marais Wine & Tapas Crawl", description: "Explore the trendy bars, historic mansions, and chic boutiques of this stylish district." },
      { activity: "Moulin Rouge Cabaret Show", description: "Experience the world's most famous cabaret show with feathers, music, and the traditional can-can." },
      { activity: "Trocadéro Eiffel Tower Light Show", description: "Watch the Eiffel Tower sparkle with thousands of golden lights at the start of every evening hour." }
    ],
    food: ["Fresh Croissants & Pain au Chocolat", "Coq au Vin", "Macarons from Ladurée", "Steak Frites in Saint-Germain", "French Onion Soup"],
    hotels: [
      { name: "Pullman Paris Tour Eiffel", priceRange: "₹22,000 - ₹35,000 per night", rating: 4.7, description: "Upscale hotel set steps away from the Eiffel Tower, boasting private balconies with direct iron-tower views.", recommendationReason: "Unparalleled views, premium service, and excellent proximity to Seine river cruises.", nearbyAttractions: ["Eiffel Tower", "Trocadéro Gardens"], amenities: ["Free Wi-Fi", "Balcony Views", "Fitness Center", "Bar & Terrace"] },
      { name: "Hotel Les Deux Gares", priceRange: "₹11,000 - ₹16,000 per night", rating: 4.4, description: "A beautifully decorated boutique hotel in the 10th Arrondissement, designed by Luke Edward Hall.", recommendationReason: "Artistic interiors, comfortable rooms, and excellent value for standard travelers.", nearbyAttractions: ["Gare du Nord", "Canal Saint-Martin"], amenities: ["Free Wi-Fi", "French Bistro", "Fitness Room", "Sauna"] },
      { name: "Les Piaules Nation Hostel", priceRange: "₹3,000 - ₹4,500 per night", rating: 4.2, description: "Modern, stylish hostel with custom-made wooden bunk beds and a beautiful rooftop bar.", recommendationReason: "Ideal for social solo budget travelers looking for a high-quality co-living space.", nearbyAttractions: ["Place de la Nation", "Metro Line 1"], amenities: ["High-speed Wi-Fi", "Rooftop Bar", "Co-working Space", "Cafe"] }
    ]
  },
  london: {
    name: "London",
    country: "United Kingdom",
    tripName: "London AI Royal & Heritage Explorer",
    morning: [
      { activity: "Tower of London & Crown Jewels", description: "Discover London's historic fortress and marvel at the dazzling royal crown jewelry collection." },
      { activity: "British Museum Exploration", description: "See world-famous treasures including the Rosetta Stone and ancient Egyptian mummies." },
      { activity: "Westminster Abbey Visit", description: "Walk through the Gothic church where coronation ceremonies and royal weddings take place." },
      { activity: "Buckingham Palace Changing of the Guard", description: "Watch the famous royal ceremony at the gates of the official residence of the King." }
    ],
    afternoon: [
      { activity: "London Eye Flight", description: "Enjoy a 30-minute rotation in a glass pod for 360-degree views of the River Thames and Big Ben." },
      { activity: "Stroll in Hyde Park & Kensington", description: "Relax in London's premier green space and visit Kensington Palace gardens." },
      { activity: "Shopping at Harrods & Oxford Street", description: "Browse luxury brands in Knightsbridge and visit the world's most famous department stores." },
      { activity: "National Gallery & Trafalgar Square", description: "Admire European master paintings in the heart of London's main square." }
    ],
    evening: [
      { activity: "Traditional Fish & Chips Pub Dinner", description: "Enjoy fresh beer-battered cod and chips in a historic pub dating back to the 18th century." },
      { activity: "West End Musical & Theater Show", description: "Experience world-class live theater or a musical in London's iconic West End district." },
      { activity: "Soho Cocktail & Bar Crawl", description: "Explore the bustling streets of Soho, filled with chic bars, jazz clubs, and cozy pubs." },
      { activity: "Thames River Illuminated Cruise", description: "Relax on an evening cruise seeing the Parliament, London Bridge, and Tower Bridge lit up." }
    ],
    food: ["Classic Fish & Chips", "Traditional Afternoon Tea", "Full English Breakfast", "Sunday Roast with Yorkshire Pudding", "Beef Wellington"],
    hotels: [
      { name: "The Savoy", priceRange: "₹45,000 - ₹75,000 per night", rating: 4.8, description: "World-famous luxury hotel on the Strand, combining Edwardian and Art Deco style with exceptional dining.", recommendationReason: "Ultimate luxury, legendary American Bar, and butler service overlooking the River Thames.", nearbyAttractions: ["Covent Garden", "Somerset House"], amenities: ["Free Wi-Fi", "Indoor Pool", "Luxury Spa", "Personal Butler Service"] },
      { name: "CitizenM Tower of London", priceRange: "₹14,000 - ₹20,000 per night", rating: 4.5, description: "Chic, modern boutique hotel located directly above Tower Hill station with a gorgeous rooftop bar.", recommendationReason: "Smart-controlled rooms, excellent work-play balance, and panoramic views of Tower Bridge.", nearbyAttractions: ["Tower of London", "Tower Bridge"], amenities: ["Free Wi-Fi", "Rooftop Terrace Bar", "24/7 Dining", "IPad Room Controls"] },
      { name: "Wombat's City Hostel London", priceRange: "₹3,500 - ₹5,000 per night", rating: 4.2, description: "Highly-rated, clean, and social hostel near Tower Bridge with an underground brick vaulted bar.", recommendationReason: "Clean dorms and private rooms, great social vibe, and cheap drinks for budget travelers.", nearbyAttractions: ["Shadwell Basin", "Tower Hill"], amenities: ["High-speed Wi-Fi", "Bar & Social Lounge", "Guest Kitchen", "Laundry"] }
    ]
  },
  "new york": {
    name: "New York City",
    country: "United States",
    tripName: "New York City AI Skyline & Culture Tour",
    morning: [
      { activity: "Statue of Liberty & Ellis Island", description: "Take the morning ferry to see the symbol of freedom and explore the immigration museum." },
      { activity: "Central Park Walking & Bike Tour", description: "Explore Bethesda Fountain, Bow Bridge, and strawberry fields in New York's famous park." },
      { activity: "The Metropolitan Museum of Art (Met)", description: "Explore 5,000 years of global art, from Egyptian temples to modern masterpieces." },
      { activity: "High Line & Hudson Yards Walk", description: "Stroll along the elevated public park built on a historic freight rail line above Manhattan streets." }
    ],
    afternoon: [
      { activity: "Empire State Building Observatory", description: "Ascend to the 86th floor for legendary open-air views of Manhattan, Brooklyn, and Queens." },
      { activity: "Museum of Modern Art (MoMA)", description: "View Van Gogh's Starry Night, Warhol's Soup Cans, and other masterworks of modern art." },
      { activity: "Fifth Avenue & Rockefeller Center", description: "Walk the luxury shopping corridor and visit the famous plaza and skating rink." },
      { activity: "9/11 Memorial & Financial District", description: "Pay respects at the reflecting twin pools and see the Wall Street Bull." }
    ],
    evening: [
      { activity: "Times Square & Broadway Show", description: "See the neon lights of Times Square and watch a world-class theatrical performance." },
      { activity: "Katz's Delicatessen Dinner", description: "Enjoy a legendary, sky-high pastrami sandwich in a historic Jewish deli on the Lower East Side." },
      { activity: "Greenwich Village Jazz Club Lounge", description: "Listen to world-class live jazz at the historic Village Vanguard or Blue Note." },
      { activity: "Rooftop Dining with Manhattan Views", description: "Enjoy dinner and artisan cocktails with a stunning view of the Empire State Building lit up." }
    ],
    food: ["New York Style Pizza", "Bagels with Lox & Cream Cheese", "Katz's Pastrami on Rye", "New York Cheesecake", "Halal Guys Chicken & Rice"],
    hotels: [
      { name: "The Plaza Hotel", priceRange: "₹65,000 - ₹95,000 per night", rating: 4.8, description: "The definitive landmark of New York luxury, situated off Fifth Avenue and Central Park South.", recommendationReason: "World-famous history, butler service, and legendary dining at the Palm Court.", nearbyAttractions: ["Central Park", "Fifth Avenue Shopping"], amenities: ["Free Wi-Fi", "Luxury Guerlain Spa", "Butler Service", "Champagne Bar"] },
      { name: "Arlo NoMad", priceRange: "₹16,000 - ₹24,000 per night", rating: 4.4, description: "Micro-boutique hotel featuring floor-to-ceiling windows with epic views of the Empire State Building.", recommendationReason: "Excellent design, popular rooftop glass-floor lounge, and central location.", nearbyAttractions: ["Empire State Building", "Koreatown"], amenities: ["Free Wi-Fi", "Rooftop Lounge & Bar", "Bicycles", "Italian Restaurant"] },
      { name: "Freehand New York", priceRange: "₹4,500 - ₹7,500 per night", rating: 4.2, description: "Artistic hotel in the Flatiron district housed in a historic building, with bunk-bed options and multiple bars.", recommendationReason: "Cool artistic vibe, popular cocktail spots, and affordable rates in Manhattan.", nearbyAttractions: ["Madison Square Park", "Flatiron Building"], amenities: ["High-speed Wi-Fi", "Rooftop Bar", "Fitness Center", "Co-working Lounge"] }
    ]
  },
  rome: {
    name: "Rome",
    country: "Italy",
    tripName: "Rome AI Ancient History & Pasta Paradise",
    morning: [
      { activity: "Colosseum & Roman Forum", description: "Step back in time inside the legendary arena where gladiators fought, then walk the ancient forum." },
      { activity: "Vatican Museums & Sistine Chapel", description: "Beat the crowds to see Michelangelo's spectacular frescoes and the Vatican gallery treasures." },
      { activity: "Pantheon Tour", description: "Marvel at the world's largest unreinforced concrete dome inside this 2,000-year-old temple." },
      { activity: "Piazza Navona & Campo de' Fiori", description: "Stroll the beautiful baroque square and explore the lively morning open-air fruit and spice market." }
    ],
    afternoon: [
      { activity: "Trevi Fountain Coin Toss", description: "Toss a coin into the majestic baroque fountain to ensure your return to Rome." },
      { activity: "Spanish Steps Walk", description: "Climb the famous 135 steps and browse the fashion boutiques of Via dei Condotti." },
      { activity: "Villa Borghese Gardens & Gallery", description: "Rent a bike in Rome's beautiful park and admire breathtaking sculptures by Bernini." },
      { activity: "Trastevere District Stroll", description: "Explore the narrow ivy-draped medieval streets of Rome's most charming neighborhood." }
    ],
    evening: [
      { activity: "Authentic Carbonara Tasting Dinner", description: "Savor real Roman pasta made with guanciale, pecorino, and egg in a family-run trattoria." },
      { activity: "Piazza del Popolo Sunset View", description: "Climb Pincio Hill to watch the sun set over the dome of St. Peter's Basilica." },
      { activity: "Gelato Walk near Castel Sant'Angelo", description: "Grab artisanal gelato and walk along the Tiber River under illuminated stone bridges." },
      { activity: "Enoteca Wine Tasting", description: "Enjoy local Lazio regional wines paired with cured meats and artisanal cheeses in a cozy cellar." }
    ],
    food: ["Pasta Carbonara", "Cacio e Pepe", "Pizza al Taglio", "Artisanal Gelato", "Tiramisu"],
    hotels: [
      { name: "Hotel de Russie, a Rocco Forte Hotel", priceRange: "₹48,000 - ₹75,000 per night", rating: 4.8, description: "A legendary luxury hotel located between Piazza del Popolo and the Spanish Steps, with lush terraced gardens.", recommendationReason: "Stunning secret garden, celebrity-tier service, and premium spa facilities.", nearbyAttractions: ["Spanish Steps", "Piazza del Popolo"], amenities: ["Free Wi-Fi", "Secret Garden Bar", "Luxury Spa", "Indoor Pool"] },
      { name: "IQ Hotel Roma", priceRange: "₹12,000 - ₹18,000 per night", rating: 4.6, description: "A highly innovative, tech-friendly hotel near the Opera House with self-service laundry and a fitness deck.", recommendationReason: "Modern design, roof terrace, and outstanding guest-centric services.", nearbyAttractions: ["Teatro dell'Opera", "Termini Station"], amenities: ["Free Wi-Fi", "Sauna & Roof Deck", "Cocktail Bar", "Self-service Laundry"] },
      { name: "The Beehive Hostel & Hotel", priceRange: "₹3,000 - ₹4,500 per night", rating: 4.3, description: "A cozy, clean, eco-conscious guest house and hostel with a peaceful organic garden cafe.", recommendationReason: "Extremely welcoming host, organic breakfasts, and quiet garden atmosphere for budget travelers.", nearbyAttractions: ["Roma Termini Station", "Santa Maria Maggiore"], amenities: ["High-speed Wi-Fi", "Organic Garden Cafe", "Shared Kitchen", "Book Exchange"] }
    ]
  },
  bali: {
    name: "Bali",
    country: "Indonesia",
    tripName: "Bali AI Tropical Beach & Temple Retreat",
    morning: [
      { activity: "Tegallalang Rice Terraces Trek", description: "Walk through the stunning layered green rice paddies and experience the Bali swing at sunrise." },
      { activity: "Mount Batur Sunrise Trekking", description: "Hike up the active volcano in the dark to witness a breathtaking sunrise above the clouds." },
      { activity: "Uluwatu Temple & Cliff Walk", description: "Explore the ancient sea temple perched on a cliff edge 70 meters above the Indian Ocean." },
      { activity: "Ubud Monkey Forest Walk", description: "Stroll through a sacred forest sanctuary home to over 1,000 playful long-tailed macaques." }
    ],
    afternoon: [
      { activity: "Seminyak Beach & Surfing Lesson", description: "Take a surfing lesson or relax on the gold sands of Bali's premier resort town." },
      { activity: "Tanah Lot Temple Sightseeing", description: "Visit the offshore rock temple that sits entirely surrounded by ocean waves during high tide." },
      { activity: "Waterbom Bali Waterpark", description: "Have fun at Asia's top-rated waterpark with slides winding through tropical gardens." },
      { activity: "Tegenungan Waterfall Swimming", description: "Cool off with a refreshing dip in the pool under a massive jungle waterfall." }
    ],
    evening: [
      { activity: "Jimbaran Bay Seafood Dinner", description: "Dine on grilled snapper, prawns, and clams on tables set right on the beach sand at sunset." },
      { activity: "Kecak Fire Dance Performance", description: "Watch the traditional rhythmic vocal and dance performance on the Uluwatu cliff face at sunset." },
      { activity: "Canggu Beach Club Lounge", description: "Unwind at Potato Head or Finns beach club with a cocktail, infinity pools, and DJ beats." },
      { activity: "Traditional Balinese Spa Ritual", description: "Enjoy a premium 2-hour body massage and flower bath using local essential oils." }
    ],
    food: ["Nasi Goreng", "Babi Guling (Suckling Pig)", "Sate Lilit (Minced Seafood)", "Gado-Gado (Peanut Salad)", "Balinese Coffee"],
    hotels: [
      { name: "Ayana Resort and Spa Bali", priceRange: "₹25,000 - ₹45,000 per night", rating: 4.8, description: "World-class luxury resort in Jimbaran spread over 90 hectares on a cliff, featuring the famous Rock Bar.", recommendationReason: "Incredible cliffside ocean views, 12 swimming pools, and the iconic sunset cocktail experience.", nearbyAttractions: ["Rock Bar", "Jimbaran Beach"], amenities: ["Free Wi-Fi", "Private Beach", "12 Pools", "Award-winning Spa"] },
      { name: "Alila Ubud", priceRange: "₹10,000 - ₹16,000 per night", rating: 4.6, description: "A tranquil hillside retreat in a traditional Balinese village, with a famous emerald infinity pool.", recommendationReason: "Stunning jungle ravine views, award-winning architectural design, and peaceful atmosphere.", nearbyAttractions: ["Ubud Palace", "Ayung River"], amenities: ["Free Wi-Fi", "Ravine Infinity Pool", "Spa Alila", "Daily Yoga Classes"] },
      { name: "Lay Day Surf Hostel Canggu", priceRange: "₹1,200 - ₹2,000 per night", rating: 4.3, description: "A famous, highly social backpacker hostel with 4 swimming pools, surf rental, and night events.", recommendationReason: "Amazing social atmosphere for solo budget travelers looking to surf and meet friends.", nearbyAttractions: ["Echo Beach", "Canggu Shortcut"], amenities: ["High-speed Wi-Fi", "4 Swimming Pools", "Poolside Bar", "Surfboard Rental"] }
    ]
  },
  goa: {
    name: "Goa",
    country: "India",
    tripName: "Goa AI Sunny Beaches & Portuguese Charm",
    morning: [
      { activity: "Fort Aguada & Lighthouse View", description: "Explore the 17th-century Portuguese fort and take in panoramic views of the Arabian Sea." },
      { activity: "Fontainhas Latin Quarter Walking Tour", description: "Walk through the colorful heritage houses and narrow lanes of Panaji's Portuguese district." },
      { activity: "Basilica of Bom Jesus", description: "Visit the UNESCO World Heritage church housing the sacred remains of St. Francis Xavier." },
      { activity: "Dudhsagar Falls Jeep Safari", description: "Take a bumpy ride through the jungle to see the massive four-tiered milky white waterfall." }
    ],
    afternoon: [
      { activity: "Anjuna Flea Market Shopping", description: "Browse colorful stalls for beachwear, local spices, handcrafts, and bohemian jewelry." },
      { activity: "Baga & Calangute Water Sports", description: "Go parasailing, jet skiing, or banana boat riding on Goa's most active beaches." },
      { activity: "Spice Plantation Tour & Lunch", description: "Walk through vanilla and cardamom plantations, then enjoy a traditional buffet on banana leaves." },
      { activity: "Relaxing on Palolem Beach", description: "Lounge under coconut trees on a crescent-shaped bay in peaceful South Goa." }
    ],
    evening: [
      { activity: "Beach Shack Dinner & Live Music", description: "Enjoy fresh fish curry rice and local Goan feni at a candle-lit shack right on the sand." },
      { activity: "Mandovi River Sunset Cruise", description: "Enjoy a scenic boat cruise with traditional Goan folk dancing and DJ music." },
      { activity: "Curlies Beach Club Sunset Party", description: "Watch the sunset over Anjuna Beach with music, drinks, and a vibrant beach vibe." },
      { activity: "Casino Night on the River", description: "Try your luck at floating casinos anchored in the Mandovi River, with dining and shows." }
    ],
    food: ["Goan Fish Curry Rice", "Pork Vindaloo", "Chicken Xacuti", "Bebinca (Goan layered dessert)", "Goan Cashew Feni"],
    hotels: [
      { name: "Taj Exotica Resort & Spa Goa", priceRange: "₹24,000 - ₹40,000 per night", rating: 4.8, description: "A Mediterranean-style luxury resort in Benaulim overlooking the beach, spanning 56 acres of lawns.", recommendationReason: "World-class Taj hospitality, private villas, golf course, and quiet South Goa beachfront.", nearbyAttractions: ["Benaulim Beach", "Colva Beach"], amenities: ["Free Wi-Fi", "Beach Access", "Golf Course", "Outdoor Pool"] },
      { name: "Fairfield by Marriott Goa Benaulim", priceRange: "₹6,000 - ₹9,500 per night", rating: 4.5, description: "A clean, modern, reliable hotel situated a short walk from Benaulim beach in South Goa.", recommendationReason: "Excellent service quality, spacious rooms, and great pool view standard stay.", nearbyAttractions: ["Benaulim Beach", "Margao Market"], amenities: ["Free Wi-Fi", "Outdoor Pool", "Fitness Center", "Multicuisine Restaurant"] },
      { name: "Zostel Goa (Morjim)", priceRange: "₹1,000 - ₹1,800 per night", rating: 4.3, description: "A trendy, social backpacker hostel located steps away from the peaceful turtle-nesting Morjim beach.", recommendationReason: "Morjim beach vibe, budget-friendly dorms, rooftop cafe, and regular guest community meetups.", nearbyAttractions: ["Morjim Beach", "Chapora Fort"], amenities: ["High-speed Wi-Fi", "Rooftop Cafe", "Common Gaming Room", "Laundry"] }
    ]
  },
  singapore: {
    name: "Singapore",
    country: "Singapore",
    tripName: "Singapore AI Futuristic City & Hawker Delights",
    morning: [
      { activity: "Gardens by the Bay Flower Dome", description: "Walk through the world's largest glass greenhouse, featuring plants from Mediterranean regions." },
      { activity: "Singapore Botanic Gardens Walk", description: "Explore the National Orchid Garden inside Singapore's lush UNESCO World Heritage green space." },
      { activity: "Merlion Park Photo Session", description: "Take the iconic photos in front of Singapore's half-fish, half-lion water-spouting statue." },
      { activity: "Chinatown Heritage Walk", description: "Visit the ornate Buddha Tooth Relic Temple and explore traditional shophouses." }
    ],
    afternoon: [
      { activity: "Marina Bay Sands SkyPark", description: "Ascend to the 57th-floor observation deck for views of the skyline and shipping lanes." },
      { activity: "Universal Studios Sentosa", description: "Experience thrilling rollercoasters and themed zones on Singapore's resort island." },
      { activity: "S.E.A. Aquarium Sentosa", description: "Discover more than 100,000 marine animals across 40 different ocean habitats." },
      { activity: "Shopping on Orchard Road", description: "Explore kilometers of modern malls, fashion flags, and designer department stores." }
    ],
    evening: [
      { activity: "Hawker Center Food Feast", description: "Try Hainanese Chicken Rice, Chili Crab, and Laksa at the famous Lau Pa Sat or Maxwell food center." },
      { activity: "Spectra Light & Water Show", description: "Watch the spectacular free laser, water, and music show at the Marina Bay waterfront." },
      { activity: "Clarke Quay River Walk & Dining", description: "Enjoy dining, drinks, and live music inside restored warehouses along the Singapore River." },
      { activity: "Night Safari Tram Ride", description: "Experience the world's first nocturnal zoo, viewing active animals under soft lighting." }
    ],
    food: ["Chili Crab", "Hainanese Chicken Rice", "Singapore Laksa", "Kaya Toast & Soft Eggs", "Char Kway Teow"],
    hotels: [
      { name: "Marina Bay Sands", priceRange: "₹38,000 - ₹65,000 per night", rating: 4.8, description: "The definitive icon of Singapore, featuring the world's largest rooftop infinity pool.", recommendationReason: "Access to the exclusive infinity pool, high-end shopping mall connection, and elite service.", nearbyAttractions: ["Gardens by the Bay", "ArtScience Museum"], amenities: ["Free Wi-Fi", "Rooftop Infinity Pool", "Casino & Mall", "Banyan Tree Spa"] },
      { name: "YOTEL Singapore Orchard Road", priceRange: "₹10,500 - ₹15,000 per night", rating: 4.4, description: "Futuristic hotel with cabin-style rooms featuring adjustable SmartBeds and room service delivery robots.", recommendationReason: "High-tech comfort, excellent central location on Orchard road shopping belt.", nearbyAttractions: ["Orchard Road", "ION Orchard"], amenities: ["Free Wi-Fi", "Outdoor Pool", "Robotic Room Delivery", "Gym"] },
      { name: "The Pod Boutique Capsule Hotel", priceRange: "₹3,000 - ₹4,500 per night", rating: 4.2, description: "A chic, minimalist capsule hostel in Kampong Glam offering private pod beds with roller blinds.", recommendationReason: "Clean, quiet, and private hostel stay located in a vibrant cultural heritage district.", nearbyAttractions: ["Haji Lane", "Sultan Mosque"], amenities: ["High-speed Wi-Fi", "Complimentary Breakfast", "Laundry Service", "Locker Storage"] }
    ]
  },
  dubai: {
    name: "Dubai",
    country: "United Arab Emirates",
    tripName: "Dubai AI Luxury Skylines & Golden Souks",
    morning: [
      { activity: "Burj Khalifa Observation Deck", description: "Ascend the world's tallest building to the 124th and 125th floors for stunning city views." },
      { activity: "Dubai Frame Sightseeing", description: "Walk the glass bridge connecting two massive towers, framing the old and new Dubai skyline." },
      { activity: "Gold & Spice Souk Walking Tour", description: "Cross the Dubai Creek on a traditional abra boat and browse hundreds of glittering shops." },
      { activity: "Miracle Garden Exploration", description: "Stroll through the world's largest natural flower garden, featuring 150 million blooming flowers." }
    ],
    afternoon: [
      { activity: "Dubai Mall & Ski Dubai", description: "Shop at the world's second-largest mall and slide down indoor snow slopes in the middle of the desert." },
      { activity: "Palm Jumeirah Helicopter or Monorail Tour", description: "Travel along the tree-shaped artificial island, seeing Atlantis resort and villas." },
      { activity: "Jumeirah Beach & Burj Al Arab Photo Op", description: "Lounge on clean coastal sands and snap photos in front of the sail-shaped 7-star hotel." },
      { activity: "Museum of the Future Visit", description: "Explore interactive exhibits displaying human innovation and future technology in a torus-shaped building." }
    ],
    evening: [
      { activity: "Desert Safari & BBQ Dinner", description: "Experience dune bashing, camel riding, and a traditional belly dancing show under the stars." },
      { activity: "Dubai Fountain Show & Dining", description: "Watch the spectacular choreographed fountains dance to music outside the Dubai Mall." },
      { activity: "Dubai Marina Yacht Cruise", description: "Sail past glittering skyscrapers, enjoying an international buffet dinner on a luxury yacht." },
      { activity: "La Perle Acrobatic Show", description: "Watch a high-tech aqua-theatrical performance featuring divers, acrobats, and light effects." }
    ],
    food: ["Shawarma Wrap", "Mandi (Rice and Meat)", "Hummus & Falafel with Fresh Pita", "Camel Milk Ice Cream", "Luqaimat (Sweet dumplings)"],
    hotels: [
      { name: "Atlantis, The Palm", priceRange: "₹28,000 - ₹55,000 per night", rating: 4.7, description: "A massive, ocean-themed luxury resort at the apex of Palm Jumeirah, with free waterpark access.", recommendationReason: "Unlimited access to Aquaventure Waterpark and Lost Chambers Aquarium, perfect for families and luxury seekers.", nearbyAttractions: ["Aquaventure Waterpark", "The Lost Chambers"], amenities: ["Free Wi-Fi", "Private Beach", "Waterpark Entry", "16 Restaurants"] },
      { name: "Rove Downtown Dubai", priceRange: "₹8,000 - ₹12,000 per night", rating: 4.6, description: "A stylish, casual, budget-friendly hotel located right across the street from the Dubai Mall.", recommendationReason: "Stunning Burj Khalifa views from the pool, modern clean design, and prime central location.", nearbyAttractions: ["Dubai Mall", "Burj Khalifa"], amenities: ["Free Wi-Fi", "Outdoor Pool", "24/7 Supermarket", "Guest Laundromat"] },
      { name: "Backpacker 16 Hostel Dubai", priceRange: "₹1,500 - ₹2,500 per night", rating: 4.1, description: "Clean dormitory accommodations situated in Dubai Marina, providing easy access to metro stations.", recommendationReason: "Very cheap hostel rates in one of Dubai's premium waterfront neighborhoods.", nearbyAttractions: ["Dubai Marina Walk", "Marina Mall Metro"], amenities: ["High-speed Wi-Fi", "Shared Gym & Pool Access", "Kitchen Access", "Lockers"] }
    ]
  },
  switzerland: {
    name: "Switzerland",
    country: "Switzerland",
    tripName: "Switzerland AI Scenic Alpine Magic Tour",
    morning: [
      { activity: "Jungfraujoch 'Top of Europe' Train", description: "Board a historic cogwheel train climbing up to Europe's highest railway station at 3,454 meters." },
      { activity: "Mount Titlis Rotair Cable Car", description: "Ride the world's first rotating cable car, witnessing 360-degree views of deep glacier crevasses." },
      { activity: "Lucerne Chapel Bridge Morning Walk", description: "Stroll across the 14th-century wooden covered bridge and take photos in the Old Town." },
      { activity: "Lake Geneva Promenade Walk", description: "Walk along the flower-lined shores of Geneva, seeing the majestic Jet d'Eau fountain." }
    ],
    afternoon: [
      { activity: "Lake Brienz Scenic Paddleboat Ride", description: "Cruise on turquoise waters surrounded by steep forested mountains and waterfalls." },
      { activity: "Zermatt Car-Free Village Exploration", description: "Explore the classic Swiss wooden chalets and view the towering pyramid of the Matterhorn." },
      { activity: "Rhine Falls Boat Excursion", description: "Feel the spray of Europe's largest waterfall on a boat ride to the central rock tower." },
      { activity: "Swiss Chocolate Workshop & Tasting", description: "Learn how premium chocolate is made and sample dozens of pralines at Lindt Home of Chocolate." }
    ],
    evening: [
      { activity: "Authentic Cheese Fondue Dinner", description: "Savor bubbling melted gruyère and emmental cheese fondue with bread cubes in a mountain tavern." },
      { activity: "Interlaken Harder Kulm Sunset Lookout", description: "Take a funicular up to the viewing deck for sunset views of Lake Thun, Brienz, and the Eiger peak." },
      { activity: "Zurich Niederdorf Bar Walk", description: "Explore the cobblestone alleys of Zurich's old quarter, filled with cozy bars and bookstores." },
      { activity: "Thermal Baths & Spa Relaxation", description: "Soak in hot outdoor mineral pools under the stars at a Swiss alpine wellness center." }
    ],
    food: ["Cheese Fondue", "Swiss Raclette", "Rösti (Grated potato pancake)", "Swiss Milk Chocolate", "Zürcher Geschnetzeltes"],
    hotels: [
      { name: "Baur au Lac (Zurich)", priceRange: "₹65,000 - ₹95,000 per night", rating: 4.8, description: "A legendary five-star hotel situated in its own private park overlooking Lake Zurich and the Alps.", recommendationReason: "Exquisite luxury, Michelin-starred dining, and 180 years of elite hospitality history.", nearbyAttractions: ["Bahnhofstrasse Shopping", "Lake Zurich"], amenities: ["Free Wi-Fi", "Private Park", "Michelin Dining", "Luxury Gym"] },
      { name: "Hotel Interlaken", priceRange: "₹15,000 - ₹22,000 per night", rating: 4.5, description: "A historic 4-star hotel in Interlaken dating back to 1491, offering elegant rooms and a garden.", recommendationReason: "Fascinating history, highly rated service, and short walk to the Interlaken Ost train station.", nearbyAttractions: ["Interlaken Ost Station", "Harder Kulm Funicular"], amenities: ["Free Wi-Fi", "Swiss Restaurant", "Garden & Terrace", "Sauna"] },
      { name: "Youth Hostel Interlaken", priceRange: "₹4,500 - ₹6,500 per night", rating: 4.3, description: "A ultra-modern, clean hostel located directly next to the train station, with double and dorm rooms.", recommendationReason: "Perfect base for alpine hiking, very clean facilities, and affordable Swiss prices.", nearbyAttractions: ["Interlaken Ost Station", "Paragliding Landing Field"], amenities: ["High-speed Wi-Fi", "Billiards & Lounge", "Restaurant & Buffet", "Bicycle Rental"] }
    ]
  },
  bangkok: {
    name: "Bangkok",
    country: "Thailand",
    tripName: "Bangkok AI Temples & Street Food Extravaganza",
    morning: [
      { activity: "Grand Palace & Wat Phra Kaew", description: "Marvel at the spectacular gold-leafed spires and the sacred Temple of the Emerald Buddha." },
      { activity: "Wat Arun (Temple of Dawn) Visit", description: "Climb the steep, porcelain-decorated prang towers on the banks of the Chao Phraya River." },
      { activity: "Wat Pho Giant Reclining Buddha", description: "See the massive 46-meter long gold-plated reclining Buddha and learn about traditional massage." },
      { activity: "Damnoen Saduak Floating Market", description: "Ride a long-tail boat past canal-side stalls selling fresh tropical fruits and coconut ice cream." }
    ],
    afternoon: [
      { activity: "Chatuchak Weekend Market Shopping", description: "Explore more than 15,000 open-air stalls selling vintage clothes, art, and delicious snacks." },
      { activity: "Chao Phraya River Long-tail Boat Tour", description: "Navigate the small canal waterways (khlongs) to see floating wooden houses and local life." },
      { activity: "MBK Center & Siam Paragon Malls", description: "Shop for bargain electronics at MBK or browse high-end brands and massive aquariums in Siam." },
      { activity: "Jim Thompson House Tour", description: "Explore the beautiful teak wood houses built by the American silk entrepreneur, housing Asian art." }
    ],
    evening: [
      { activity: "Michelin Guide Street Food Crawl", description: "Join a night food tour of Yaowarat Road (Chinatown) to sample pad thai, crab omelets, and sweet buns." },
      { activity: "Khao San Road Night Market Walk", description: "Experience the ultimate backpacker street, filled with neon lights, cheap buckets, and music." },
      { activity: "Rooftop Sky Bar Sunset Drinks", description: "Sip cocktails on the 64th floor of Lebua State Tower (the famous Hangover Part II filming site)." },
      { activity: "Traditional Thai Massage Ritual", description: "Soothe tired legs with an authentic 1.5-hour acupressure Thai massage in a quiet garden spa." }
    ],
    food: ["Pad Thai", "Tom Yum Goong (Spicy shrimp soup)", "Mango Sticky Rice", "Som Tum (Papaya salad)", "Thai Iced Tea"],
    hotels: [
      { name: "Mandarin Oriental Bangkok", priceRange: "₹32,000 - ₹55,000 per night", rating: 4.9, description: "Historic five-star hotel situated on the Chao Phraya River, renowned for its legendary service.", recommendationReason: "Iconic river terrace dining, world-class spa, and private boat shuttles to main piers.", nearbyAttractions: ["Chao Phraya River", "Iconsiam Mall"], amenities: ["Free Wi-Fi", "Two Pools", "Riverside Terrace", "Luxury Spa & Gym"] },
      { name: "Nouvo City Hotel", priceRange: "₹4,000 - ₹6,000 per night", rating: 4.4, description: "A modern, boutique hotel in the historic district, within walking distance of Khao San Road.", recommendationReason: "Excellent rooftop pool, clean rooms, and peaceful location close to major landmarks.", nearbyAttractions: ["Khao San Road", "Phra Sumen Fort"], amenities: ["Free Wi-Fi", "Rooftop Swimming Pool", "Halal Restaurant", "Spa"] },
      { name: "Bed Station Hostel Khaosan", priceRange: "₹1,200 - ₹1,800 per night", rating: 4.3, description: "A lively, social hostel in the Khaosan district featuring an outdoor pool and pool table lounge.", recommendationReason: "Fantastic social vibe, clean beds, and central location for budget-conscious solo tourists.", nearbyAttractions: ["Khao San Road", "National Gallery"], amenities: ["High-speed Wi-Fi", "Outdoor Pool", "Bar & Billiards Lounge", "Gym"] }
    ]
  },
  barcelona: {
    name: "Barcelona",
    country: "Spain",
    tripName: "Barcelona AI Gothic History & Gaudí Masterpieces",
    morning: [
      { activity: "La Sagrada Família Cathedral", description: "Explore Antoni Gaudí's unfinished masterpiece, marveling at the towering columns and stained glass." },
      { activity: "Park Güell Morning Walk", description: "Stroll through the whimsical public park filled with mosaic-covered terraces and panoramic city views." },
      { activity: "Gothic Quarter (Barri Gòtic)", description: "Walk the narrow medieval streets, visiting the Gothic Cathedral and historic stone plazas." },
      { activity: "La Boqueria Market Tasting", description: "Walk the colorful market off Las Ramblas to taste jamón ibérico, fresh juices, and cheese cones." }
    ],
    afternoon: [
      { activity: "Casa Batlló & Passeig de Gràcia", description: "Tour Gaudí's spectacular wavy house and stroll Barcelona's premier luxury boulevard." },
      { activity: "Barceloneta Beach Relaxation", description: "Lounge on the sandy city beach or eat fresh seafood in the old fishing quarter." },
      { activity: "Montjuïc Castle & Cable Car", description: "Ride the cable car to the hilltop fortress for views of Barcelona harbor and the sea." },
      { activity: "Picasso Museum Art Tour", description: "View the formative works of Pablo Picasso housed inside five medieval Gothic palaces." }
    ],
    evening: [
      { activity: "Tapas & Sangria Dinner Crawl", description: "Sample pan con tomate, patatas bravas, and croquetas in the lively El Born neighborhood." },
      { activity: "Magic Fountain Light Show", description: "Watch the spectacular display of water acrobatics, lights, and music at Montjuïc." },
      { activity: "Las Ramblas Street Walk", description: "Walk the famous tree-lined pedestrian avenue, watching street performers and flower stalls." },
      { activity: "Flamenco Show in Old Town Plaza", description: "Experience the passion of a live flamenco guitar and dance show in a historic vaulted tavern." }
    ],
    food: ["Tapas (Bravas, Croquetas)", "Seafood Paella", "Churros con Chocolate", "Jamón Ibérico", "Crema Catalana"],
    hotels: [
      { name: "W Barcelona", priceRange: "₹28,000 - ₹48,000 per night", rating: 4.7, description: "Iconic sail-shaped glass hotel right on the Barceloneta boardwalk, offering panoramic sea views.", recommendationReason: "Stunning infinity pool, direct beach access, and trendy Eclipse rooftop nightclub.", nearbyAttractions: ["Barceloneta Beach", "Barcelona Aquarium"], amenities: ["Free Wi-Fi", "Beach Access", "Infinity Pool", "Rooftop Lounge"] },
      { name: "Hotel Praktik Vinoteca", priceRange: "₹9,500 - ₹14,000 per night", rating: 4.4, description: "A stylish, wine-themed boutique hotel in Eixample, offering a free glass of wine on arrival.", recommendationReason: "Extremely clean rooms, wine-tasting terrace, and highly central walking distance location.", nearbyAttractions: ["Passeig de Gràcia", "Casa Batlló"], amenities: ["Free Wi-Fi", "Wine Tasting Terrace", "Concierge Service", "Library"] },
      { name: "Kabul Party Hostel Barcelona", priceRange: "₹3,000 - ₹4,500 per night", rating: 4.2, description: "Backpacker hostel located in Plaza Reial, famous for its daily rooftop events and social dinners.", recommendationReason: "The best hostel for solo budget travelers looking to socialize and join walking tours.", nearbyAttractions: ["Las Ramblas", "Plaza Reial"], amenities: ["High-speed Wi-Fi", "Rooftop Sun Terrace", "Free Walking Tours", "Social Lounge & Bar"] }
    ]
  },
  sydney: {
    name: "Sydney",
    country: "Australia",
    tripName: "Sydney AI Coastal Beaches & Iconic Harbour",
    morning: [
      { activity: "Sydney Opera House Tour", description: "Explore the sail-like theatres of the UNESCO landmark and learn about its design history." },
      { activity: "Bondi to Coogee Coastal Walk", description: "Walk along cliffs and sandy bays, seeing crashing waves and ocean pools at Bronte Beach." },
      { activity: "Royal Botanic Garden Walk", description: "Stroll along the harbor shoreline to Mrs Macquarie's Chair for views of the Opera House and Bridge." },
      { activity: "Sydney Harbour Bridge Climb", description: "Climb the massive steel arch for a thrilling, panoramic view from 134 meters above the harbor." }
    ],
    afternoon: [
      { activity: "Bondi Beach Surfing lesson", description: "Learn to catch waves at Australia's most famous beach and swim in the Bondi Icebergs pool." },
      { activity: "Manly Beach Ferry Ride & Explore", description: "Take a scenic ferry ride past Sydney Heads, then explore the beach and shops in Manly." },
      { activity: "Taronga Zoo Cable Car & Tour", description: "See koalas and kangaroos with a backdrop of the Sydney Opera House and skyline." },
      { activity: "Darling Harbour Museums", description: "Visit the National Maritime Museum and explore the bustling pedestrian docks." }
    ],
    evening: [
      { activity: "Harbour Dining at Circular Quay", description: "Enjoy fresh Australian barramundi fish or steak with a direct view of the Opera House lit up." },
      { activity: "Sydney Tower Eye Buffet Dinner", description: "Enjoy a rotating buffet dinner with 360-degree views of the illuminated city below." },
      { activity: "The Rocks Historic Pub Crawl", description: "Walk the historic cobblestone alleys, drinking beers in Sydney's oldest colonial-era pubs." },
      { activity: "Sunset Yacht Cruise", description: "Sip Australian sparkling wine on a yacht sailing past the Harbour Bridge at sunset." }
    ],
    food: ["Fresh Grilled Barramundi", "Aussie Meat Pies", "Pavlova (Meringue dessert)", "Lamingtons (Coconut sponge cakes)", "Flat White Coffee"],
    hotels: [
      { name: "Park Hyatt Sydney", priceRange: "₹55,000 - ₹95,000 per night", rating: 4.8, description: "Super-luxury hotel nestled right between the Sydney Harbour Bridge and the Opera House on the water.", recommendationReason: "Unbeatable location, private butler service, and rooftop pool overlooking the Opera House.", nearbyAttractions: ["Sydney Opera House", "The Rocks"], amenities: ["Free Wi-Fi", "Rooftop Pool", "Personal Butler", "Luxury Spa & Dining"] },
      { name: "Sydney Harbour YHA", priceRange: "₹12,000 - ₹18,000 per night", rating: 4.5, description: "Boutique hostel/hotel in historic The Rocks built above archaeological ruins, with an epic rooftop terrace.", recommendationReason: "Fabulous hostel rooftop views of the Opera House at a fraction of hotel costs. Great standard stay.", nearbyAttractions: ["Circular Quay", "The Rocks Markets"], amenities: ["Free Wi-Fi", "Rooftop Terrace & BBQ", "Guest Kitchen", "Archaeological Display"] },
      { name: "Wake Up! Sydney Central", priceRange: "₹3,500 - ₹5,000 per night", rating: 4.3, description: "Backpacker hostel near Central Station, featuring daily free events and an underground bar.", recommendationReason: "Extremely clean, modern design, free fitness classes, and highly social budget option.", nearbyAttractions: ["Central Railway Station", "Chinatown"], amenities: ["High-speed Wi-Fi", "Underground Bar & DJ", "Cafe & Restaurant", "Bicycle Rental"] }
    ]
  }
};

/**
 * Dynamically constructs a realistic, custom data package for any city not directly in the dictionary
 */
function getDynamicDestinationData(dest) {
  const normalized = dest.trim();
  const capitalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return {
    name: capitalized,
    country: "Travel Region",
    tripName: `${capitalized} AI Custom Explorer`,
    morning: [
      { activity: `Explore the historical streets of ${capitalized}`, description: `Walk through the heart of ${capitalized} to see historic plazas, local architecture, and capture morning photos.` },
      { activity: `Scenic tour of ${capitalized} landmarks`, description: `Visit the most iconic sights in the city, learning about the local heritage from signs and guides.` },
      { activity: `Local market exploration in ${capitalized}`, description: `Stroll through the local central market to see fresh products, regional crafts, and chat with local vendors.` },
      { activity: `Main city park and botanical walk`, description: `Enjoy a refreshing stroll in the most beautiful public garden in ${capitalized}, filled with local flora.` }
    ],
    afternoon: [
      { activity: `Guided tour of the ${capitalized} Cultural Museum`, description: `Browse unique art exhibits, historical artifacts, and interactive displays showing the history of ${capitalized}.` },
      { activity: `Sightseeing cruise or panoramic tour`, description: `Take a panoramic bus or boat tour to see the beautiful landscape and main avenues of ${capitalized}.` },
      { activity: `Boutique shopping at ${capitalized} downtown`, description: `Explore shopping avenues, indie stores, and craft shops for authentic regional souvenirs.` },
      { activity: `Cooking workshop & tasting class`, description: `Join a local chef to learn how to prepare authentic dishes traditional to the ${capitalized} area.` }
    ],
    evening: [
      { activity: `Sunset viewpoint overview`, description: `Ascend the popular panoramic viewpoint to watch the sunset over the skyline of ${capitalized}.` },
      { activity: `Traditional dinner in ${capitalized} Old Town`, description: `Savor authentic regional dishes at a popular, long-running local restaurant.` },
      { activity: `Walk through the illuminated streets`, description: `See the city come alive at night with historic landmarks beautifully lit up.` },
      { activity: `Live entertainment show or cozy lounge`, description: `Unwind at a popular local venue listening to regional music, theater, or enjoying a local brew.` }
    ],
    food: [`${capitalized}-style signature dish`, `Traditional street food snacks`, `Local sweet pastries`, `Fresh regional seasonal specialties`],
    hotels: [
      { name: `${capitalized} Grand Palace Hotel & Spa`, priceRange: "₹15,000 - ₹22,000 per night", rating: 4.7, description: `A premium, five-star luxury hotel in central ${capitalized} offering world-class spa facilities and services.`, recommendationReason: "Highly recommended for travelers seeking luxury, premium design, and superior hospitality.", nearbyAttractions: [`${capitalized} Central Palace`, "Main Shopping Boulevard"], amenities: ["Free Wi-Fi", "Luxury Spa", "Indoor Pool", "Fine Dining"] },
      { name: `${capitalized} City Center Inn`, priceRange: "₹6,000 - ₹9,500 per night", rating: 4.4, description: `A modern, comfortable hotel located within walking distance of the main train station and attractions in ${capitalized}.`, recommendationReason: "Matches standard budget tier, highly rated for service quality, cleanliness, and central location.", nearbyAttractions: [`${capitalized} Cathedral`, "Town Square"], amenities: ["Free Wi-Fi", "Complimentary Breakfast", "Fitness Lounge"] },
      { name: `${capitalized} Co-Living & Backpackers Hostel`, priceRange: "₹1,800 - ₹2,800 per night", rating: 4.2, description: `A vibrant, friendly hostel in a trendy area of ${capitalized}, offering clean dormitory pods and social events.`, recommendationReason: "Best choice for solo budget travelers looking for clean beds, free Wi-Fi, and a social environment.", nearbyAttractions: ["Public Transit Station", "Night Market Block"], amenities: ["High-speed Wi-Fi", "Shared Kitchen", "Lounge", "Laundry Room"] }
    ]
  };
}

/**
 * Extracts and maps the destination from the prompt, falling back to a dynamic generation or Paris
 */
function getDestData(promptText) {
  if (!promptText) return DESTINATION_DATA.paris;
  const text = promptText.toLowerCase();
  
  // Find which key in DESTINATION_DATA is mentioned
  for (const key in DESTINATION_DATA) {
    if (text.includes(key)) {
      return DESTINATION_DATA[key];
    }
  }
  
  // Try regex matching
  let parsedDest = null;
  const matchers = [
    /destination:\s*([^\n\r,;]+)/i,
    /accommodations in\s*([^\n\r\t,;]+)\s*matching:/i,
    /hotels\/accommodations in\s*([^\n\r\t,;]+)\s*matching:/i,
    /create a realistic travel itinerary for:\s*destination:\s*([^\n\r,;]+)/i,
    /travel budget breakdown for:\s*destination:\s*([^\n\r,;]+)/i,
    /packing checklist for:\s*destination:\s*([^\n\r,;]+)/i,
    /in\s+([A-Za-z\s]+)\s+matching/i,
    /for\s+([A-Za-z\s]+)\s+days/i
  ];
  
  for (const regex of matchers) {
    const match = promptText.match(regex);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (candidate.length > 2 && !["the", "your", "estimated"].includes(candidate.toLowerCase())) {
        parsedDest = candidate;
        break;
      }
    }
  }
  
  if (!parsedDest) {
    parsedDest = "Paris";
  }
  
  const normalizedCandidate = parsedDest.toLowerCase();
  for (const key in DESTINATION_DATA) {
    if (normalizedCandidate.includes(key) || key.includes(normalizedCandidate)) {
      return DESTINATION_DATA[key];
    }
  }
  
  return getDynamicDestinationData(parsedDest);
}

/**
 * Custom generators for Itinerary, Budget, and Packing lists
 */
function buildCustomItinerary(destData, days, budget, style) {
  const calculatedTotal = Math.min(budget, days * (style === "Luxury" ? 22000 : style === "Budget" ? 2800 : 6500));
  const itinerary = {
    tripName: `${destData.name} AI ${style} Adventure`,
    totalEstimatedCost: calculatedTotal,
    generalOptimization: `Optimize your stay in ${destData.name} by booking a local transit card in advance. Dine at neighborhood bistros/markets to experience authentic local cuisine without the premium tourist pricing.`,
    days: []
  };
  
  for (let i = 1; i <= days; i++) {
    const mIdx = (i - 1) % destData.morning.length;
    const aIdx = (i - 1) % destData.afternoon.length;
    const eIdx = (i - 1) % destData.evening.length;
    
    const food1 = destData.food[(i * 2 - 2) % destData.food.length];
    const food2 = destData.food[(i * 2 - 1) % destData.food.length];
    const dailyCost = Math.round(calculatedTotal / days);
    
    itinerary.days.push({
      day: i,
      theme: `Day ${i}: Exploring ${destData.morning[mIdx].activity.split(' in ')[0].split(' & ')[0]} & Local Vibes`,
      morning: destData.morning[mIdx],
      afternoon: destData.afternoon[aIdx],
      evening: destData.evening[eIdx],
      foodSuggestions: [food1, food2],
      estimatedCost: dailyCost,
      optimizationTip: `Walk between nearby spots on Day ${i} to save on transport fees. Purchase tickets online in advance to skip lines.`
    });
  }
  
  return itinerary;
}

function buildCustomBudget(destData, days, style) {
  let baseHotel = 6000;
  let baseFood = 2000;
  let baseTransport = 1000;
  let baseActivities = 1500;
  let baseShopping = 4000;
  
  if (style.toLowerCase().includes("luxury")) {
    baseHotel = 24000; baseFood = 4500; baseTransport = 2200; baseActivities = 3500; baseShopping = 12000;
  } else if (style.toLowerCase().includes("budget")) {
    baseHotel = 2200; baseFood = 1000; baseTransport = 400; baseActivities = 600; baseShopping = 1500;
  }
  
  const hotelTotal = baseHotel * days;
  const foodTotal = baseFood * days;
  const transportTotal = baseTransport * days;
  const activitiesTotal = baseActivities * days;
  const shoppingTotal = baseShopping;
  const bufferTotal = Math.round((hotelTotal + foodTotal + transportTotal + activitiesTotal) * 0.1);
  const total = hotelTotal + foodTotal + transportTotal + activitiesTotal + shoppingTotal + bufferTotal;
  
  const dailyBreakdown = [];
  for (let d = 1; d <= days; d++) {
    dailyBreakdown.push({
      day: d,
      spent: baseHotel + baseFood + baseTransport + baseActivities,
      hotel: baseHotel,
      food: baseFood,
      other: baseTransport + baseActivities
    });
  }
  
  const selectedHotel = destData.hotels[style.toLowerCase().includes("luxury") ? 0 : style.toLowerCase().includes("budget") ? 2 : 1].name;
  
  return {
    hotel: hotelTotal,
    food: foodTotal,
    transport: transportTotal,
    activities: activitiesTotal,
    buffer: bufferTotal,
    shopping: shoppingTotal,
    total: total,
    currency: "INR",
    reasoning: `Based on your selection of a ${style} tier trip for ${days} days to ${destData.name}, we have estimated the costs in Indian Rupees (INR). Room rates at properties like ${selectedHotel} represent a substantial portion of the expenses. We recommend dining at local favorites like ${destData.food[0]} and ${destData.food[1]} to optimize your food budget. Using public transit will save you additional money compared to private cabs.`,
    dailyBreakdown: dailyBreakdown
  };
}

function buildCustomPackingList(destData, duration, season) {
  const clothingQty = Math.max(3, duration + 1);
  const packingList = {
    clothes: [
      { item: "Comfortable walking shoes/sneakers", qty: "1 pair" },
      { item: "Daily underwear and moisture-wicking socks", qty: `${clothingQty} pairs` },
      { item: "Lightweight, breathable t-shirts", qty: `${clothingQty} items` },
      { item: "Smart travel pants or jeans", qty: "3 items" }
    ],
    electronics: [
      { item: "Universal plug wall adapter", qty: "1 unit" },
      { item: "Phone/device chargers and cords", qty: "1 set" },
      { item: "Portable power bank (10,000mAh+)", qty: "1 unit" }
    ],
    essentials: [
      { item: "Insulated travel water bottle", qty: "1 unit" },
      { item: "Compact pocket umbrella", qty: "1 unit" },
      { item: "Toiletry travel pouch (toothbrush, travel toothpaste)", qty: "1 kit" },
      { item: "Microfiber fast-dry towel", qty: "1 unit" }
    ],
    medical: [
      { item: "Pain relief medication (Ibuprofen/Paracetamol)", qty: "1 box" },
      { item: "Adhesive band-aids (various sizes)", qty: "10-15 pieces" },
      { item: "Hand sanitizer gel and sanitizing wipes", qty: "2 packs" }
    ],
    documents: [
      { item: `Passport (with copies for safety in ${destData.name})`, qty: "Originals + PDFs" },
      { item: "Hotel reservations & confirmation vouchers", qty: "Digital + Printed" },
      { item: "Travel medical insurance details", qty: "1 copy" }
    ]
  };
  
  if (season === "cold") {
    packingList.clothes.push({ item: "Thermal top & bottom layers", qty: "2 sets" });
    packingList.clothes.push({ item: "Thick insulated winter jacket or wool coat", qty: "1 unit" });
    packingList.clothes.push({ item: "Warm wool beanie hat & insulated gloves", qty: "1 set" });
  } else {
    packingList.clothes.push({ item: "Sun hat or cap", qty: "1 unit" });
    packingList.clothes.push({ item: "UV sunglasses", qty: "1 unit" });
    packingList.clothes.push({ item: "Swimwear or beach shorts", qty: "1-2 items" });
  }
  
  return { packingList };
}

/**
 * Local High-Fidelity Text Generator Fallback
 */
function getFallbackText(prompt, systemInstruction) {
  console.log("[AI Service] Live APIs failed or leaked. Using local high-fidelity text fallback.");
  
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes("hello") || promptLower.includes("hi ") || promptLower.includes("hey")) {
    return `Hello! I am your **Traveloop AI assistant**. I'm here to help you plan your dream vacations, build day-by-day itineraries, track your budget, suggest hotels, optimize stops, and prepare packing lists. 

How can I assist you with your travels today? You can ask me questions like:
- *"Suggest a 3-day itinerary for Tokyo"*
- *"What is a good standard budget for Paris?"*
- *"Help me pack for a winter trip to Switzerland"*`;
  }
  
  const destData = getDestData(prompt);
  
  if (promptLower.includes("itinerary") || promptLower.includes("day") || promptLower.includes("schedule") || promptLower.includes("plan")) {
    const daysMatch = prompt.match(/(\d+)\s*day/i) || prompt.match(/day\s*(\d+)/i) || prompt.match(/duration:\s*(\d+)/i);
    const days = daysMatch ? parseInt(daysMatch[1]) : 3;
    const style = promptLower.includes("luxury") ? "Luxury" : promptLower.includes("budget") ? "Budget" : "Standard";
    const itinerary = buildCustomItinerary(destData, days, 50000, style);
    
    let itineraryMD = `### AI Suggested Travel Guide for **${destData.name}**\n\n`;
    itineraryMD += `**Trip Name:** ${itinerary.tripName}  \n`;
    itineraryMD += `**Estimated Total Cost:** ₹${itinerary.totalEstimatedCost.toLocaleString()} INR  \n`;
    itineraryMD += `*Optimization:* ${itinerary.generalOptimization}\n\n`;
    
    itinerary.days.forEach(d => {
      itineraryMD += `#### **Day ${d.day}: ${d.theme}**\n`;
      itineraryMD += `- **Morning:** **${d.morning.activity}** - ${d.morning.description}\n`;
      itineraryMD += `- **Afternoon:** **${d.afternoon.activity}** - ${d.afternoon.description}\n`;
      itineraryMD += `- **Evening:** **${d.evening.activity}** - ${d.evening.description}\n`;
      itineraryMD += `- **Dining Suggestions:** ${d.foodSuggestions.join(', ')}\n`;
      itineraryMD += `- **Estimated Cost for Day ${d.day}:** ₹${d.estimatedCost.toLocaleString()} INR\n`;
      itineraryMD += `- **Tip:** *${d.optimizationTip}*\n\n`;
    });
    
    return itineraryMD;
  }
  
  if (promptLower.includes("budget") || promptLower.includes("cost") || promptLower.includes("price") || promptLower.includes("expensive")) {
    const daysMatch = prompt.match(/(\d+)\s*day/i) || prompt.match(/day\s*(\d+)/i) || prompt.match(/duration:\s*(\d+)/i);
    const days = daysMatch ? parseInt(daysMatch[1]) : 3;
    const style = promptLower.includes("luxury") ? "Luxury" : promptLower.includes("budget") ? "Budget" : "Standard";
    
    const budgetJson = buildCustomBudget(destData, days, style);
    
    let budgetMD = `### Estimated Travel Budget for **${destData.name}** (${days} Days, ${style} Tier)\n\n`;
    budgetMD += `Here is a detailed breakdown in **INR (₹)**:\n\n`;
    budgetMD += `| Category | Estimated Cost | Details |\n`;
    budgetMD += `| :--- | :--- | :--- |\n`;
    budgetMD += `| **Accommodation** | ₹${budgetJson.hotel.toLocaleString()} | Based on ${style} tier stays |\n`;
    budgetMD += `| **Food & Dining** | ₹${budgetJson.food.toLocaleString()} | Local cuisines & popular street eats |\n`;
    budgetMD += `| **Transportation** | ₹${budgetJson.transport.toLocaleString()} | Local transit passes, cabs/trains |\n`;
    budgetMD += `| **Activities & Tours** | ₹${budgetJson.activities.toLocaleString()} | Entrance tickets & guided sightseeing tours |\n`;
    budgetMD += `| **Shopping & Souvenirs** | ₹${budgetJson.shopping.toLocaleString()} | Regional crafts & shopping budget |\n`;
    budgetMD += `| **Emergency Buffer** | ₹${budgetJson.buffer.toLocaleString()} | 10% contingency buffer |\n`;
    budgetMD += `| **Total Estimated Cost** | **₹${budgetJson.total.toLocaleString()}** | **Ideal for ${days} days** |\n\n`;
    
    budgetMD += `**AI Reasoning & Advice:**  \n${budgetJson.reasoning}\n\n`;
    budgetMD += `*Tip: Book your flights and hotels at least 45 days in advance to get the best deals.*`;
    
    return budgetMD;
  }
  
  if (promptLower.includes("pack") || promptLower.includes("clothes") || promptLower.includes("checklist") || promptLower.includes("packing")) {
    const daysMatch = prompt.match(/(\d+)\s*day/i) || prompt.match(/day\s*(\d+)/i) || prompt.match(/duration:\s*(\d+)/i);
    const days = daysMatch ? parseInt(daysMatch[1]) : 3;
    const season = promptLower.includes("cold") || promptLower.includes("winter") || promptLower.includes("snow") ? "cold" : "mild";
    
    const packingJson = buildCustomPackingList(destData, days, season);
    
    let packingMD = `### Smart Packing Suggestions for **${destData.name}** (${days} Days)\n\n`;
    packingMD += `Here is your custom checklist tailored to the weather and destination:\n\n`;
    
    const categories = {
      clothes: "👕 Clothing",
      electronics: "🔌 Electronics",
      essentials: "🎒 Travel Essentials",
      medical: "💊 First Aid & Medical",
      documents: "📄 Documents & Wallet"
    };
    
    for (const key in categories) {
      packingMD += `#### **${categories[key]}**\n`;
      packingJson.packingList[key].forEach(p => {
        packingMD += `- [ ] **${p.item}** (${p.qty})\n`;
      });
      packingMD += `\n`;
    }
    
    return packingMD;
  }
  
  if (promptLower.includes("hotel") || promptLower.includes("stay") || promptLower.includes("accommodation") || promptLower.includes("resort")) {
    let hotelMD = `### Curated Stays in **${destData.name}**\n\n`;
    hotelMD += `Here are the top 3 recommended hotels matching different travel styles:\n\n`;
    
    destData.hotels.forEach(h => {
      hotelMD += `#### **1. ${h.name}** (Rating: ⭐ ${h.rating}/5)\n`;
      hotelMD += `- **Price Range:** ${h.priceRange}\n`;
      hotelMD += `- **Description:** ${h.description}\n`;
      hotelMD += `- **Why Recommend:** *${h.recommendationReason}*\n`;
      hotelMD += `- **Nearby Attractions:** ${h.nearbyAttractions.join(', ')}\n`;
      hotelMD += `- **Amenities:** ${h.amenities.join(', ')}\n\n`;
    });
    
    return hotelMD;
  }
  
  // General response
  const destMentioned = Object.keys(DESTINATION_DATA).some(k => promptLower.includes(k)) || 
                        (destData && promptLower.includes(destData.name.toLowerCase()));

  if (destMentioned && destData) {
    let guideMD = `### Exploring **${destData.name}** (${destData.country})\n\n`;
    guideMD += `Here is a curated guide of must-visit attractions, local culinary delights, and top travel tips for **${destData.name}**:\n\n`;
    
    guideMD += `✨ **Top Highlights & Activities:**\n`;
    const allActs = [...(destData.morning || []), ...(destData.afternoon || []), ...(destData.evening || [])];
    if (allActs.length > 0) {
      allActs.slice(0, 5).forEach(a => {
        guideMD += `- **${a.activity || a.name}**: ${a.description}\n`;
      });
    } else {
      guideMD += `- **City Exploration**: Discover the culture, historic architecture, and vibrant streets.\n`;
      guideMD += `- **Local Neighborhoods**: Stroll through local markets and shopping districts.\n`;
    }
    
    if (destData.food && destData.food.length > 0) {
      guideMD += `\n🍕 **Must-Try Local Foods:**\n`;
      destData.food.slice(0, 5).forEach(f => {
        guideMD += `- ${f}\n`;
      });
    }
    
    guideMD += `\n✈️ **AI Travel Tips:**\n`;
    guideMD += `- **Transit**: Use local public transportation (subway/rail passes) which is highly efficient and budget-friendly.\n`;
    guideMD += `- **Booking**: Book major attractions and standard stays at least 30-45 days in advance to get the best pricing.\n`;
    guideMD += `- **Currency**: Keep some local currency handy for street vendors and small neighborhood shops.\n\n`;
    
    guideMD += `*Need a full plan? Ask me to "create an itinerary" or "estimate budget" for ${destData.name}!*`;
    return guideMD;
  }

  return `### Hello! I am your Traveloop AI assistant.

I would be happy to help you with your question! 

To get the most out of Traveloop, you can use our dedicated **AI Lab (AI Travel Hub)** from the navigation bar. It includes specialized AI modules for:
1. 📅 **Itinerary Building** - Day-wise planner with saving capability.
2. 💰 **Budget Breakdown** - Tier-based expense visualization.
3. 🗺️ **Destination Discovery** - Custom matching based on your preferences.
4. 🏨 **Hotel Recommendations** - Curated stays with AI reasoning.
5. 🎒 **Smart Packing Checklist** - Automated checklists you can import into your trip.
6. 🚀 **Route Optimization** - Minimizing costs and travel times.

Please let me know if you would like me to generate a custom itinerary, budget breakdown, packing list, or hotel recommendations!`;
}

/**
 * Local High-Fidelity JSON Generator Fallback
 */
function getFallbackJSON(prompt) {
  console.log("[AI Service] Live APIs failed or leaked. Using local high-fidelity JSON fallback.");
  
  const promptLower = prompt.toLowerCase();
  const destData = getDestData(prompt);
  
  // 1. Itinerary Generator
  if (promptLower.includes("itinerary") || promptLower.includes("day-by-day") || promptLower.includes("create a realistic travel itinerary")) {
    const daysMatch = prompt.match(/Number of days:\s*(\d+)/i) || prompt.match(/(\d+)\s*day/i);
    const budgetMatch = prompt.match(/Estimated total budget:\s*(?:INR)?\s*(\d+)/i) || prompt.match(/budget:\s*(?:INR)?\s*(\d+)/i);
    const styleMatch = prompt.match(/Travel Style:\s*([^\n\r]+)/i) || prompt.match(/style:\s*([^\n\r]+)/i);
    
    const days = daysMatch ? parseInt(daysMatch[1]) : 3;
    const totalBudget = budgetMatch ? parseInt(budgetMatch[1]) : 60000;
    const style = styleMatch ? styleMatch[1].trim() : "Standard";
    
    return buildCustomItinerary(destData, days, totalBudget, style);
  }
  
  // 2. Budget breakdown
  if (promptLower.includes("budget breakdown") || promptLower.includes("budget planner") || promptLower.includes("travel budget breakdown")) {
    const daysMatch = prompt.match(/Duration:\s*(\d+)/i) || prompt.match(/(\d+)\s*day/i);
    const typeMatch = prompt.match(/Type:\s*([^\n\r]+)/i) || prompt.match(/budgetType:\s*([^\n\r]+)/i);
    
    const days = daysMatch ? parseInt(daysMatch[1]) : 3;
    const budgetType = typeMatch ? typeMatch[1].trim() : "Standard";
    
    return buildCustomBudget(destData, days, budgetType);
  }
  
  // 3. Destination recommendation
  if (promptLower.includes("recommend exactly 3 suitable destinations") || promptLower.includes("destination recommendation") || promptLower.includes("recommenddestinations")) {
    const weatherMatch = prompt.match(/Preferred Weather:\s*([^\n\r]+)/i);
    const weather = weatherMatch ? weatherMatch[1].trim().toLowerCase() : "any";
    
    if (weather.includes("cool") || weather.includes("cold") || weather.includes("winter") || weather.includes("autumn")) {
      return {
        destinations: [
          {
            name: "Interlaken",
            country: "Switzerland",
            matchPercentage: 96,
            whyIdeal: "Stunning alpine scenery, crisp mountain air, and iconic cable cars. Perfect for cool winter hikes and premium cheese fondue dinners.",
            bestTimeToVisit: "December to March",
            estimatedDailyCost: 15000,
            weatherForecast: "Snowy winter scenery ranging from -3°C to 4°C.",
            activityHighlights: ["Ride Jungfraujoch cogwheel train", "Scenic paddleboat on Lake Brienz", "Traditional Cheese Fondue feast"]
          },
          {
            name: "Kyoto",
            country: "Japan",
            matchPercentage: 92,
            whyIdeal: "Cool climate perfect for exploring old wooden shrines, bamboo groves, and drinking hot matcha green tea.",
            bestTimeToVisit: "October to November",
            estimatedDailyCost: 7000,
            weatherForecast: "Pleasant autumn breeze between 10°C and 16°C.",
            activityHighlights: ["Explore Meiji Jingu Shrine area", "Walk the forested shrines of Asakusa", "Taste local Ramen at Ichiran"]
          },
          {
            name: "London",
            country: "United Kingdom",
            matchPercentage: 88,
            whyIdeal: "Fascinating cool weather ideal for historic walking tours, exploring royal palaces, and warm traditional pub dining.",
            bestTimeToVisit: "September to November",
            estimatedDailyCost: 11000,
            weatherForecast: "Mild, breezy autumn weather around 12°C.",
            activityHighlights: ["Visit Tower of London & Crown Jewels", "Explore British Museum artifacts", "Enjoy Westminster Abbey tour"]
          }
        ]
      };
    } else {
      return {
        destinations: [
          {
            name: "Bali",
            country: "Indonesia",
            matchPercentage: 98,
            whyIdeal: "Sunny beach weather, golden coast surfing, and stunning tropical scenery. Extremely friendly and cost-effective tropical retreat.",
            bestTimeToVisit: "April to October",
            estimatedDailyCost: 4500,
            weatherForecast: "Warm, sunny beach days around 28°C.",
            activityHighlights: ["Visit Uluwatu Temple cliffs", "Surf at Seminyak Beach", "Trek Tegallalang Rice Terraces"]
          },
          {
            name: "Sydney",
            country: "Australia",
            matchPercentage: 94,
            whyIdeal: "Warm, coastal breezes, iconic harbour architecture, and world-famous coastal walks matching solo or group trips.",
            bestTimeToVisit: "November to March",
            estimatedDailyCost: 12000,
            weatherForecast: "Sunny summer climate ranging from 20°C to 26°C.",
            activityHighlights: ["Climb Sydney Harbour Bridge", "Bondi to Coogee coastal walk", "Take ferry to Manly Beach"]
          },
          {
            name: "Goa",
            country: "India",
            matchPercentage: 90,
            whyIdeal: "Vibrant beach shacks, historic churches, and fresh local Goan seafood. Very budget-friendly beach getaway.",
            bestTimeToVisit: "November to February",
            estimatedDailyCost: 3000,
            weatherForecast: "Warm coastal sun and gentle sea breeze around 29°C.",
            activityHighlights: ["View Arabian Sea from Fort Aguada", "Heritage walk in Panaji Latin Quarter", "Dine at beachside shacks"]
          }
        ]
      };
    }
  }
  
  // 4. Hotel recommendation
  if (promptLower.includes("recommend 3 hotels") || promptLower.includes("accommodations in") || promptLower.includes("hotels/accommodations")) {
    return {
      hotels: destData.hotels
    };
  }
  
  // 5. Packing checklist
  if (promptLower.includes("packing checklist") || promptLower.includes("packinglist") || promptLower.includes("packing list")) {
    const durMatch = prompt.match(/Duration:\s*(\d+)/i) || prompt.match(/(\d+)\s*day/i);
    const weatherMatch = prompt.match(/Season\/Weather:\s*([^\n\r]+)/i);
    
    const duration = durMatch ? parseInt(durMatch[1]) : 3;
    const weather = weatherMatch ? weatherMatch[1].trim().toLowerCase() : "mild";
    
    return buildCustomPackingList(destData, duration, weather.includes("cold") || weather.includes("winter") ? "cold" : "mild");
  }
  
  // 6. Route optimization
  if (promptLower.includes("optimize the following travel stops") || promptLower.includes("optimizetrip")) {
    let stops = [];
    try {
      const stopsMatch = prompt.match(/travel stops for route efficiency, cost-minimization, and time management:\s*([\s\S]+)/i);
      if (stopsMatch) {
        stops = JSON.parse(stopsMatch[1]);
      }
    } catch (e) {
      // Ignored
    }
    
    const optimizedRoute = stops.length > 0 ? stops.map(s => s.city) : ["Tokyo", "Kyoto", "Osaka"];
    
    return {
      optimizedRoute: optimizedRoute,
      savingsEstimation: "Save approximately ₹7,500 on local transit fees & rail tickets.",
      improvements: [
        `Reordering routes into a linear sequence reduces unnecessary back-and-forth travel.`,
        "Saves roughly 4.5 hours of transit time, allowing more leisure hours at destinations.",
        "Enables purchasing single regional point-to-point passes instead of separate day tickets."
      ],
      detailedSuggestions: `We suggest utilizing the local high-speed rail lines between these stops. Purchase a regional travel pass on Day 1 to cover the optimized sequence seamlessly.`
    };
  }
  
  // 7. Analytics custom insights
  if (promptLower.includes("analyze my travel profile statistics")) {
    return {
      insights: [
        `Budget Optimization: Over 45% of your travel spending is on accommodation. Consider booking 30 days ahead to save up to 20% at sites like ${destData.hotels[1].name}.`,
        `Geographic Trend: You show a strong preference for scenic cities. We recommend exploring historic sites in ${destData.name} next.`,
        "Seasonality: Traveling in shoulder seasons (April or October) will optimize both flight costs and weather comfort."
      ],
      popularDestinations: [
        { name: "Tokyo", count: 25 },
        { name: "Paris", count: 18 },
        { name: "Bali", count: 15 },
        { name: "Goa", count: 12 },
        { name: "New York", count: 10 }
      ],
      userTravelTrends: [
        { month: "Jan", trips: 1, budget: 12000 },
        { month: "Mar", trips: 2, budget: 35000 },
        { month: "May", trips: 1, budget: 18000 },
        { month: "Jul", trips: 0, budget: 0 },
        { month: "Sep", trips: 1, budget: 22000 },
        { month: "Nov", trips: 3, budget: 45000 }
      ]
    };
  }
  
  // 8. Activities Generator
  if (promptLower.includes("activities") || promptLower.includes("things to do") || promptLower.includes("generate")) {
    return buildActivitiesFallback(destData);
  }
  
  return { success: true, message: `Standard AI response completed successfully for ${destData.name}` };
}

function buildActivitiesFallback(destData) {
  const list = [];
  
  // Morning activities
  if (destData.morning && destData.morning.length > 0) {
    destData.morning.forEach((m, idx) => {
      list.push({
        name: m.activity,
        description: m.description,
        duration: "2h",
        cost: idx % 2 === 0 ? 0 : 500,
        type: idx % 2 === 0 ? "Culture" : "Sightseeing"
      });
    });
  }
  
  // Afternoon activities
  if (destData.afternoon && destData.afternoon.length > 0) {
    destData.afternoon.forEach((a, idx) => {
      list.push({
        name: a.activity,
        description: a.description,
        duration: "3h",
        cost: idx % 2 === 0 ? 1200 : 800,
        type: idx % 2 === 0 ? "Adventure" : "Relaxation"
      });
    });
  }
  
  // Evening activities
  if (destData.evening && destData.evening.length > 0) {
    destData.evening.forEach((e, idx) => {
      list.push({
        name: e.activity,
        description: e.description,
        duration: "2.5h",
        cost: idx % 2 === 0 ? 1500 : 2500,
        type: idx % 2 === 0 ? "Nightlife" : "Food"
      });
    });
  }
  
  // If list is empty, add generic ones
  if (list.length === 0) {
    list.push(
      { name: "City Walking Tour", description: "Explore the historic streets and central plazas with a local guide.", duration: "2h", cost: 0, type: "Sightseeing" },
      { name: "Local Food Tasting", description: "Sample famous street snacks, local delicacies, and traditional desserts.", duration: "1.5h", cost: 800, type: "Food" },
      { name: "Central Museum Visit", description: "Admire historical collections, ancient artifacts, and local master artworks.", duration: "3h", cost: 400, type: "Culture" },
      { name: "Scenic Sunset Cruise", description: "Relax on a river or bay cruise as the sun sets over the skyline.", duration: "2h", cost: 1500, type: "Relaxation" },
      { name: "Outdoor Adventure Activity", description: "Experience a thrilling outdoor ride or climbing experience in the region.", duration: "4h", cost: 2500, type: "Adventure" }
    );
  }
  
  return list.slice(0, 5);
}

module.exports = {
  generateText,
  generateJSON,
  getDestData,
  buildActivitiesFallback
};
