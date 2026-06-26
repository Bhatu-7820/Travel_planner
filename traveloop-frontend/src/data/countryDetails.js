// Premium country detail data for TravelLoop Destination Detail Pages
// Contains highly immersive content for major countries and a fallback generator for other countries.

const U = (id, w = 1600, h = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

const COUNTRY_STATIC_DETAILS = {
  japan: {
    name: 'Japan',
    id: 'japan',
    flag: '🇯🇵',
    tagline: 'Land of the Rising Sun',
    quote: 'In Japan, tradition and innovation do not conflict; they flow into each other like water.',
    heroImage: U('1493976040374-85c8e12f0c0e', 1920, 1080),
    facts: {
      weather: '10°C – 22°C (Spring/Autumn)',
      currency: 'Japanese Yen (¥)',
      language: 'Japanese',
      timezone: 'GMT+9',
      visa: 'Visa on Arrival / eVisa',
      bestSeason: 'Mar – May & Oct – Nov'
    },
    about: {
      history: 'From feudal samurai lords and wooden shogunate temples to post-war industrial miracles, Japan’s history is a legendary epic of cultural resilience, philosophy, and adaptation.',
      culture: 'An elegant world where ancient tea ceremonies, kimono festivals, and silent Zen gardens coexist with vibrant pop culture, high-tech neon streets, and world-class train systems.',
      nature: 'A stunning volcanic archipelago featuring the snow-capped peak of Mt. Fuji, mystical bamboo forests in Kyoto, and coastal cliffs carved by the Pacific Ocean.',
      architecture: 'A visual marvel of hand-joined wooden pagodas, sacred red Torii gates standing in water, and hyper-futuristic glass skyscrapers lining Tokyo’s skyline.',
      people: 'Deeply defined by concepts like Omotenashi (extreme hospitality), Kodawari (perfectionism in craft), and Wa (social harmony).',
      whyLove: 'Travellers are spellbound by the absolute safety, clinical cleanliness, culinary perfection, efficient bullet trains, and the serene contrast of bustling city life and quiet temple forests.'
    },
    natureShowcase: {
      title: 'Volcanic Peaks & Bamboo Shrines',
      desc: 'A breathtaking geographical canvas shaped by thousands of years of volcanic activity. From the symmetrical snow-capped peak of Mount Fuji to the quiet, moss-covered paths of Arashiyama’s towering green bamboo, Japan’s landscapes feel like stepping into a traditional hand-painted silk scroll.',
      images: [
        U('1578271887552-5ac3a72752bc'), // Mt Fuji reflection
        U('1503899036084-c55cdd92da26'), // Arashiyama Bamboo Grove
        U('1545569341-9eb8b30979d9')  // Kyoto cherry blossom landscape
      ]
    },
    experiences: [
      {
        title: 'Cherry Blossom Viewing (Hanami)',
        desc: 'Gather beneath clouds of soft pink sakura petals in Kyoto’s Maruyama Park for a century-old traditional spring celebration.',
        duration: 'Half Day',
        season: 'Late March – Early April',
        budget: '₹1,500',
        location: 'Kyoto',
        image: U('1522441815192-d9f04eb0615c')
      },
      {
        title: 'High-Speed Bullet Train Journey (Shinkansen)',
        desc: 'Glide past Mt. Fuji at speeds over 320 km/h in Japan’s legendary bullet train, representing ultimate efficiency and luxury.',
        duration: '3 hours',
        season: 'Year-Round',
        budget: '₹8,500',
        location: 'Tokyo to Kyoto',
        image: U('1542640244-7e672d6cef21')
      },
      {
        title: 'Zen Temple Meditation & Tea Ritual',
        desc: 'Practice zazen meditation led by a resident Buddhist monk, followed by an authentic green matcha tea ceremony in a historic wooden tea room.',
        duration: '3 hours',
        season: 'Year-Round',
        budget: '₹4,000',
        location: 'Kyoto',
        image: U('1503899036084-c55cdd92da26')
      }
    ],
    places: [
      {
        name: 'Fushimi Inari Shrine',
        rating: '4.9',
        desc: 'Hike through a breathtaking path of over 10,000 vibrant vermilion Torii gates snaking up the sacred Mount Inari forest.',
        location: 'Kyoto',
        duration: '2-3 Hours',
        category: 'Cultural Shrines',
        image: U('1493976040374-85c8e12f0c0e'),
        gallery: [
          U('1493976040374-85c8e12f0c0e'),
          U('1545569341-9eb8b30979d9'),
          U('1503899036084-c55cdd92da26')
        ],
        history: 'Dedicated to Inari, the Shinto god of rice and agriculture, the shrine dates back to 711 AD, long before Kyoto became the imperial capital.',
        facts: [
          'The Torii gates are donated by local businesses and individuals to bring prosperity.',
          'Stone fox (Kitsune) statues line the paths, serving as Inari’s messengers.',
          'The hike to the summit takes about 2 to 3 hours, offering scenic city overlooks.'
        ],
        nearby: ['Tofuku-ji Temple', 'Gion District', 'Kiyomizu-dera Temple'],
        restaurants: [
          { name: 'Inari Oudon', style: 'Kitsune Udon & Inari Sushi', rating: '4.5' },
          { name: 'Nezameya', style: 'Grilled Eel (Unagi)', rating: '4.6' }
        ],
        hotels: [
          { name: 'Sowaka Ryokan', type: 'Luxury Heritage Ryokan', price: '₹45,000/night' }
        ],
        tips: [
          'Visit early in the morning (before 7:00 AM) or after sunset to avoid crowds and experience a mystical vibe.',
          'Wear comfortable walking shoes as the path is entirely stone stairs.',
          'Bring cash for street stalls selling Kitsune masks and sweet dango skewers.'
        ],
        reviews: [
          { author: 'Elena R.', rating: 5, comment: 'Simply magical. The endless red gates felt like stepping into another dimension.' }
        ]
      },
      {
        name: 'Mount Fuji & Lake Kawaguchiko',
        rating: '4.8',
        desc: 'Witness the iconic symmetrical, snow-draped volcanic peak reflecting on the glassy, calm waters of Lake Kawaguchiko.',
        location: 'Yamanashi',
        duration: 'Full Day',
        category: 'Natural Landmarks',
        image: U('1578271887552-5ac3a72752bc'),
        gallery: [
          U('1578271887552-5ac3a72752bc'),
          U('1509023464722-18d996393ca8'),
          U('1524413840003-0c315883a8f4')
        ],
        history: 'Mount Fuji is an active stratovolcano that has been worshiped as a sacred mountain for centuries, inspiring countless poets and painters like Hokusai.',
        facts: [
          'It is Japan’s highest mountain, standing at 3,776 meters.',
          'It is actually composed of three successive volcanoes.',
          'Added to the UNESCO World Heritage list in 2013 as a cultural site.'
        ],
        nearby: ['Chureito Pagoda', 'Fuji-Q Highland', 'Oshino Hakkai'],
        restaurants: [
          { name: 'Houtou Fudou', style: 'Traditional flat noodles', rating: '4.7' }
        ],
        hotels: [
          { name: 'Ubuya Ryokan', type: 'Onsen Hotel with Fuji views', price: '₹55,000/night' }
        ],
        tips: [
          'Autumn offers the clearest skies. Summer is often hazy and obscures the view.',
          'Take the ropeway up Mt. Tenjo for panoramic views of the lake and mountain.'
        ],
        reviews: [
          { author: 'Marcus D.', rating: 5, comment: 'Unreal sunset. Fuji looked absolutely flawless.' }
        ]
      }
    ],
    gallery: [
      U('1540959733332-eab4deabeeaf'),
      U('1493976040374-85c8e12f0c0e'),
      U('1503899036084-c55cdd92da26'),
      U('1528360983277-13d401cdc186'),
      U('1524413840003-0c315883a8f4'),
      U('1542640244-7e672d6cef21')
    ],
    mapMarkers: [
      { name: 'Tokyo Tower', type: 'attraction', lat: 35.6586, lng: 139.7454, desc: 'Iconic orange lattice communications tower.' },
      { name: 'Kinkaku-ji (Golden Pavilion)', type: 'attraction', lat: 35.0394, lng: 135.7292, desc: 'Zen temple covered in gold leaf.' },
      { name: 'Aman Tokyo', type: 'hotel', lat: 35.6845, lng: 139.7645, desc: 'Ultra-luxury high-rise hotel.' },
      { name: 'Sukiyabashi Jiro', type: 'restaurant', lat: 35.6722, lng: 139.7634, desc: 'Legendary sushi spot.' },
      { name: 'Fushimi Inari Shrine', type: 'attraction', lat: 34.9671, lng: 135.7727, desc: 'Shrine of 10,000 Torii gates.' }
    ],
    regions: [
      { name: 'Tokyo', desc: 'The high-energy, neon-soaked capital combining subways, skyscrapers, sushi, and anime.', image: U('1540959733332-eab4deabeeaf') },
      { name: 'Kyoto', desc: 'The cultural heartland of shrines, traditional tea rooms, and geisha districts.', image: U('1493976040374-85c8e12f0c0e') },
      { name: 'Osaka', desc: 'A street-food paradise famous for takoyaki, friendly locals, and neon nightlife.', image: U('1590253703009-7019d3a7f13a') }
    ],
    food: [
      { name: 'Sushi', type: 'Traditional', image: U('1579871494447-9811cf80d66c'), desc: 'Vinegared rice paired with premium fresh raw seafood, prepared by master chefs.', bestRestaurant: 'Sukiyabashi Jiro (Tokyo)' },
      { name: 'Takoyaki', type: 'Street Food', image: U('1504674900247-0877df9cc836'), desc: 'Savory ball-shaped snacks filled with minced octopus, brushed with savory sauce and bonito flakes.', bestRestaurant: 'Kukuru (Osaka)' },
      { name: 'Matcha Parfait', type: 'Dessert', image: U('1506084868230-bb9d95c24759'), desc: 'Rich layers of Uji green tea ice cream, red bean paste, mochi balls, and fresh cream.', bestRestaurant: 'Tsujiri (Kyoto)' },
      { name: 'Sake', type: 'Drink', image: U('1609144490800-47ee2d7be8ef'), desc: 'Traditional Japanese rice wine served warm or chilled, celebrating regional brewing crafts.', bestRestaurant: 'Sake Bar Yoramu (Kyoto)' }
    ],
    festivals: [
      { date: 'July 1 – 31', name: 'Gion Matsuri', image: U('1545569341-9eb8b30979d9'), desc: 'Kyoto’s biggest festival featuring grand parades of massive floats and night street events.', travelAdvice: 'Book accommodation 6 months in advance; streets get highly congested.' },
      { date: 'August 12 – 15', name: 'Awa Odori', image: U('1508009603885-50cf7c579365'), desc: 'A dynamic, rhythmic traditional dance festival where thousands of dancers take over the streets of Tokushima.', travelAdvice: 'Wear a light cotton yukata to join in the dance circles!' }
    ],
    weatherData: [
      { month: 'Jan', temp: 6, rain: 45, humidity: 40 },
      { month: 'Feb', temp: 7, rain: 50, humidity: 42 },
      { month: 'Mar', temp: 10, rain: 80, humidity: 48 },
      { month: 'Apr', temp: 15, rain: 110, humidity: 55 },
      { month: 'May', temp: 20, rain: 125, humidity: 60 },
      { month: 'Jun', temp: 23, rain: 160, humidity: 72 },
      { month: 'Jul', temp: 27, rain: 140, humidity: 75 },
      { month: 'Aug', temp: 28, rain: 120, humidity: 73 },
      { month: 'Sep', temp: 24, rain: 170, humidity: 70 },
      { month: 'Oct', temp: 19, rain: 100, humidity: 62 },
      { month: 'Nov', temp: 13, rain: 60, humidity: 52 },
      { month: 'Dec', temp: 8, rain: 40, humidity: 42 }
    ],
    hotels: [
      { name: 'Aman Tokyo', image: U('1566073771259-6a8506099945'), rating: '4.9', price: '₹1,20,000', amenities: ['Spa', 'Indoor Pool', 'Skyline View', 'Michelin Dining'], location: 'Otemachi, Tokyo' },
      { name: 'Hoshinoya Kyoto', image: U('1584132967334-10e028bd69f7'), rating: '4.8', price: '₹95,000', amenities: ['Traditional Futons', 'River Boat Access', 'Private Garden', 'Tea Room'], location: 'Arashiyama, Kyoto' }
    ],
    restaurants: [
      { name: 'Ryugin', cuisine: 'Kaiseki Modern', rating: '4.9', image: U('1550966871-3ed3cdb5ed0c'), hours: '18:00 – 22:30', location: 'Hibiya, Tokyo' }
    ],
    transport: {
      flights: 'Tokyo Haneda (HND) and Narita (NRT) are world-class aviation hubs connected to all continents.',
      metro: 'Tokyo Subway and Kyoto City Buses are incredibly punctual, offering IC card (Suica/Pasmo) tapping.',
      taxi: 'Clean and safe, with automatic rear doors opening. Relatively expensive, drivers rarely speak English.',
      train: 'JR Bullet Trains (Shinkansen) connect major cities in minutes with absolute safety and luxury.',
      rental: 'Requires International Driving Permit (IDP). Drive on the left side of the road.',
      airportInfo: 'Haneda is closer to downtown (25 mins by Monorail), while Narita is 60 mins away by Narita Express.'
    },
    itineraries: [
      {
        days: '2 Days',
        title: 'Tokyo Neon Blitz',
        stops: [
          { day: 'Day 1', title: 'Sensoji Temple & Shibuya Crossing', desc: 'Visit Tokyo’s oldest temple in the morning, shop in Ginza, and watch the neon lights from Shibuya Sky at sunset.' },
          { day: 'Day 2', title: 'Meiji Shrine & Shinjuku Nightlife', desc: 'Walk the forest paths of Meiji Shrine, explore Harajuku’s creative fashion lanes, and dine in Omoide Yokocho alleyways.' }
        ]
      },
      {
        days: '5 Days',
        title: 'Golden Route Classic',
        stops: [
          { day: 'Day 1-2', title: 'Tokyo Metropolis', desc: 'Explore tech hub Akihabara, cruise Tokyo Bay, and experience teamLab Planets digital art museum.' },
          { day: 'Day 3', title: 'Mount Fuji Escape', desc: 'Travel to Hakone, bathe in natural hot springs (Onsen), and ride the Lake Ashi pirate ship.' },
          { day: 'Day 4-5', title: 'Imperial Kyoto Shrines', desc: 'Ride the bullet train to Kyoto. Visit the Fushimi Inari gates, Golden Pavilion, and walk through Arashiyama Bamboo Grove.' }
        ]
      },
      {
        days: '7 Days',
        title: 'Zen and Food Odyssey',
        stops: [
          { day: 'Day 1-3', title: 'Tokyo & Mt Fuji', desc: 'Immersive exploration of traditional Asakusa, modern Shinjuku, and a scenic day trip to Kawaguchiko Lake.' },
          { day: 'Day 4-5', title: 'Historic Kyoto', desc: 'Deep dive into Zen gardens, Gion tea houses, Kaiseki dining, and Kiyomizu-dera Temple.' },
          { day: 'Day 6-7', title: 'Street Food Osaka & Nara Deer Park', desc: 'See Nara’s bowing deer and giant Buddha, then end your trip in Osaka’s Dotonbori eating takoyaki.' }
        ]
      }
    ],
    budgetEstimator: {
      budget: 8000,
      mid: 18000,
      luxury: 55000
    },
    tips: {
      safety: 'Japan has exceptionally low crime rates. It is highly safe to walk alone at night.',
      customs: 'Do NOT tip in restaurants or taxis (it is considered impolite). Stand on the left of escalators.',
      emergency: 'Police: 110 · Ambulance/Fire: 119',
      exchange: 'Cash is still widely preferred in smaller temples and ramen shops. Carry physical Yen.',
      internet: 'Rent a pocket WiFi router at the airport or activate an eSIM before arrival.',
      simCards: 'Prepaid data-only SIM cards are widely sold in electronics shops (Yodobashi Camera).',
      packing: 'Slip-on shoes are essential, as you must take your shoes off at temples and ryokans.',
      sockets: 'Type A & B sockets (two flat pins), 100V, 50/60Hz.'
    },
    aiQuestions: [
      'What is the best month to see cherry blossoms in Kyoto?',
      'Do I need physical cash in Tokyo?',
      'How do I buy a bullet train ticket?',
      'Tell me about Japan Ryokan etiquette.'
    ]
  },
  india: {
    name: 'India',
    id: 'india',
    flag: '🇮🇳',
    tagline: 'Incredible India',
    quote: 'India is not a country, but a perspective, a sensory explosion of soul, colors, and ancient spiritual sounds.',
    heroImage: U('1524413840003-0c315883a8f4', 1920, 1080),
    facts: {
      weather: '18°C – 32°C (Winter season)',
      currency: 'Indian Rupee (₹)',
      language: 'Hindi, English & 21 Official Languages',
      timezone: 'GMT+5.5',
      visa: 'eVisa pre-authorization',
      bestSeason: 'Oct – March'
    },
    about: {
      history: 'Cradle of ancient Indus Valley civilizations, birthplace of major world religions (Hinduism, Buddhism), and home to wealthy Mughal emperors and colonial histories, India is a living archaeological museum.',
      culture: 'An infinite kaleidoscope of colors, festivals like Diwali and Holi, classical sitar music, classical dances, and deep spiritual philosophies centered around yoga and Ayurveda.',
      nature: 'A massive subcontinent spanning the snow-capped Himalayan range, the Thar desert dunes, lush tea estates in Kerala, and tropical Arabian Sea coastlines.',
      architecture: 'Includes the pristine white marble Taj Mahal, red sandstone fortress walls, ancient cave carvings at Ellora, and towering Dravidian temple gates in the south.',
      people: 'Warm, hospitable, and spiritual, practicing the philosophy of "Atithi Devo Bhava" (The guest is equivalent to God).',
      whyLove: 'Travellers seek India for spiritual growth, historic luxury palaces, intense aromatic food, rich textiles, and the life-changing experience of its diverse cities.'
    },
    natureShowcase: {
      title: 'Himalayan Valleys & Tropical Canals',
      desc: 'India is a giant natural subcontinent of extreme geographical contrasts. Walk beneath the staggering snowy cliffs of the Himalayas, cruise the palm-fringed tropical backwaters of Kerala, or trace the wild tiger territories inside the ancient dry forests of Ranthambore.',
      images: [
        U('1544735716-ea4e7b12f7a1'), // Snow peaks
        U('1593693397690-362cb9666fc2'), // Kerala houseboats
        U('1561361513-2d89af450548')  // Ganges sunrise
      ]
    },
    experiences: [
      {
        title: 'Taj Mahal Sunrise Visit',
        desc: 'Witness the white marble mausoleum shift colors from lavender to gold under the early morning mist of Agra.',
        duration: '3 hours',
        season: 'October – March',
        budget: '₹1,200',
        location: 'Agra',
        image: U('1548013146-72479768bada')
      },
      {
        title: 'Kerala Backwaters Houseboat Cruise',
        desc: 'Drift past green coconut groves, paddy fields, and local villages on a luxury hand-crafted wooden Kettuvallam boat.',
        duration: '1-2 Days',
        season: 'September – March',
        budget: '₹12,000',
        location: 'Alleppey, Kerala',
        image: U('1593693397690-362cb9666fc2')
      },
      {
        title: 'Ganga Aarti Ceremony at Varanasi',
        desc: 'Watch priests perform rhythmic fire rituals on the steps of the Ganges river, reflecting flickering oil lamps and spiritual chanting.',
        duration: '2 hours',
        season: 'Year-Round',
        budget: '₹500',
        location: 'Varanasi',
        image: U('1561361513-2d89af450548')
      }
    ],
    places: [
      {
        name: 'Taj Mahal',
        rating: '4.9',
        desc: 'An iconic white-marble monument of love built by Emperor Shah Jahan in memory of his favorite wife Mumtaz Mahal.',
        location: 'Agra',
        duration: 'Half Day',
        category: 'Wonders of the World',
        image: U('1524413840003-0c315883a8f4'),
        gallery: [
          U('1524413840003-0c315883a8f4'),
          U('1548013146-72479768bada'),
          U('1598977123418-45f04b615822')
        ],
        history: 'Completed in 1648, this crown jewel of Indo-Islamic architecture required over 20,000 artisans and materials brought from all over Asia using 1,000 elephants.',
        facts: [
          'The marble changes its hue depending on the time of day and moonlight.',
          'Perfectly symmetrical except for the tomb of Shah Jahan himself, which was placed later.',
          'Surrounded by formal Persian-style gardens (Charbagh) representing Paradise.'
        ],
        nearby: ['Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh'],
        restaurants: [
          { name: 'Peshawri', style: 'Tandoori & Mughlai Cuisine', rating: '4.8' }
        ],
        hotels: [
          { name: 'The Oberoi Amarvilas', type: 'Ultra-Luxury Palace Hotel', price: '₹60,000/night' }
        ],
        tips: [
          'Agra is closed to visitors on Fridays; make sure to plan accordingly.',
          'Security is strict. Do not carry large bags, tripods, or food items inside the complex.',
          'Purchase tickets online beforehand to skip long queues at the gates.'
        ],
        reviews: [
          { author: 'Elena G.', rating: 5, comment: 'Breathtaking. No photo does justice to the scale and details of the marble inlay work.' }
        ]
      }
    ],
    gallery: [
      U('1524413840003-0c315883a8f4'),
      U('1548013146-72479768bada'),
      U('1593693397690-362cb9666fc2'),
      U('1529253355930-ddbe423a2ac7'),
      U('1561361513-2d89af450548'),
      U('1598977123418-45f04b615822')
    ],
    mapMarkers: [
      { name: 'Taj Mahal', type: 'attraction', lat: 27.1751, lng: 78.0421, desc: 'World heritage monument of love.' },
      { name: 'Gateway of India', type: 'attraction', lat: 18.922, lng: 72.8347, desc: 'Colonial-era stone arch monument.' },
      { name: 'The Taj Mahal Palace', type: 'hotel', lat: 18.9217, lng: 72.8333, desc: 'Heritage hotel facing the Arabian Sea.' },
      { name: 'Qutub Minar', type: 'attraction', lat: 28.5244, lng: 77.1855, desc: 'Tall historic brick minaret.' }
    ],
    regions: [
      { name: 'Delhi', desc: 'The historic capital housing ancient forts, political avenues, and spicy street foods.', image: U('1587474260584-136574528ed5') },
      { name: 'Rajasthan', desc: 'Land of desert kings, golden forts, romantic pink palaces, and camel safaris.', image: U('1599661046289-e31897846e41') },
      { name: 'Kerala', desc: '"God’s Own Country" famous for palm-fringed houseboats, tea gardens, and Ayurveda.', image: U('1593693397690-362cb9666fc2') }
    ],
    food: [
      { name: 'Butter Chicken & Naan', type: 'Traditional', image: U('1603894584373-5ac82b2ae398'), desc: 'Tender tandoori chicken simmered in a velvety, buttery spiced tomato sauce, eaten with clay-oven flatbread.', bestRestaurant: 'Moti Mahal (Delhi)' },
      { name: 'Dosa', type: 'Street Food', image: U('1668236543090-82eba5ee5976'), desc: 'Thin, crispy fermented rice crepes stuffed with spiced potato mash, served with coconut chutneys and lentil sambar.', bestRestaurant: 'MTR (Bengaluru)' },
      { name: 'Gulab Jamun', type: 'Dessert', image: U('1587314168485-3236d6710814'), desc: 'Golden, soft fried milk-solid spheres soaked in sticky green cardamom and saffron sugar syrup.', bestRestaurant: 'Haldiram’s (Kolkata)' },
      { name: 'Masala Chai', type: 'Drink', image: U('1576092768241-dec231879fc3'), desc: 'Robust black tea brewed with fresh milk, crushed ginger, cardamom, cinnamon, and cloves.', bestRestaurant: 'Local Tapris (Everywhere)' }
    ],
    festivals: [
      { date: 'October or November', name: 'Diwali', image: U('1548013146-72479768bada'), desc: 'The Festival of Lights. Families decorate houses with oil lamps, share sweets, and light firecrackers to celebrate victory of light over darkness.', travelAdvice: 'Enjoy local sweets and illuminated market tours in Jaipur or Delhi.' },
      { date: 'March', name: 'Holi', image: U('1508009603885-50cf7c579365'), desc: 'The dynamic spring festival of colors, where people paint each other with organic color powders, dance, and drink Thandai.', travelAdvice: 'Wear old white clothes and protect your eyes and camera gear with ziploc bags.' }
    ],
    weatherData: [
      { month: 'Jan', temp: 15, rain: 15, humidity: 45 },
      { month: 'Feb', temp: 19, rain: 10, humidity: 40 },
      { month: 'Mar', temp: 26, rain: 12, humidity: 35 },
      { month: 'Apr', temp: 32, rain: 20, humidity: 30 },
      { month: 'May', temp: 36, rain: 40, humidity: 38 },
      { month: 'Jun', temp: 33, rain: 150, humidity: 65 },
      { month: 'Jul', temp: 29, rain: 260, humidity: 80 },
      { month: 'Aug', temp: 28, rain: 240, humidity: 82 },
      { month: 'Sep', temp: 28, rain: 170, humidity: 75 },
      { month: 'Oct', temp: 25, rain: 40, humidity: 58 },
      { month: 'Nov', temp: 20, rain: 10, humidity: 50 },
      { month: 'Dec', temp: 16, rain: 5, humidity: 48 }
    ],
    hotels: [
      { name: 'The Taj Mahal Palace', image: U('1566073771259-6a8506099945'), rating: '4.9', price: '₹42,000', amenities: ['Spa', 'Sea View Pool', 'Heritage Lounge', 'Butler Service'], location: 'Colaba, Mumbai' },
      { name: 'The Taj Lake Palace', image: U('1584132967334-10e028bd69f7'), rating: '4.9', price: '₹58,000', amenities: ['Lake Boat Shuttle', 'Royal Suites', 'Heritage Courtyards'], location: 'Lake Pichola, Udaipur' }
    ],
    restaurants: [
      { name: 'Indian Accent', cuisine: 'Modern Indian', rating: '4.9', image: U('1550966871-3ed3cdb5ed0c'), hours: '12:30 – 14:30, 19:00 – 23:00', location: 'New Delhi' }
    ],
    transport: {
      flights: 'Major entry points include New Delhi (DEL) and Mumbai (BOM) with flights connecting globally.',
      metro: 'Delhi Metro is exceptionally modern, fast, and clean. Metro systems are active in Mumbai, Bengaluru, and Kolkata.',
      taxi: 'Ola and Uber are widely available in cities. Auto-rickshaws are ideal for short, exciting trips.',
      train: 'Indian Railways is one of the largest networks in the world. Book AC (1AC/2AC) classes well in advance.',
      rental: 'Self-driving is NOT recommended for tourists due to complex traffic. Rent a car with a private driver.',
      airportInfo: 'IGIA Delhi is connected to the city via the high-speed orange line metro express (20 mins).'
    },
    itineraries: [
      {
        days: '2 Days',
        title: 'Golden Triangle Quick Blitz',
        stops: [
          { day: 'Day 1', title: 'Delhi Historical Wonders', desc: 'Visit the Red Fort, Qutub Minar, and drive past India Gate before enjoying street food in Chandni Chowk.' },
          { day: 'Day 2', title: 'Agra Taj Mahal Sunrise', desc: 'Drive early to Agra. Stand inside the Taj Mahal at dawn, explore Agra Fort, and head back to Delhi.' }
        ]
      },
      {
        days: '5 Days',
        title: 'Royal Rajasthan Heritage',
        stops: [
          { day: 'Day 1-2', title: 'Pink City Jaipur', desc: 'Visit Amer Fort on a hill, view Hawa Mahal (Palace of Winds), and shop for precious gems and textiles.' },
          { day: 'Day 3', title: 'Jodhpur Blue Streets', desc: 'Drive to Jodhpur, climb the massive Mehrangarh Fort overlooking blue houses, and stay in a heritage haveli.' },
          { day: 'Day 4-5', title: 'Lake City Udaipur', desc: 'Visit City Palace, take a boat ride on Lake Pichola at sunset, and explore local craft bazaars.' }
        ]
      },
      {
        days: '7 Days',
        title: 'Spiritual Ganges & Palace Experience',
        stops: [
          { day: 'Day 1-2', title: 'Delhi & Taj Mahal', desc: 'See Delhi highlights and make a luxury day trip to Agra to watch sunset over the Taj Mahal.' },
          { day: 'Day 3-5', title: 'Ancient Varanasi & Sarnath', desc: 'Fly to Varanasi. Experience sunrise boat rides on the Ganges, walk narrow alleyways, and visit Sarnath where Buddha preached.' },
          { day: 'Day 6-7', title: 'Tropical Backwaters Kerala', desc: 'Fly to Kochi. Cruise Alleppey backwaters on a private houseboat and tour organic spice plantations.' }
        ]
      }
    ],
    budgetEstimator: {
      budget: 2500,
      mid: 6500,
      luxury: 28000
    },
    tips: {
      safety: 'Stay alert in busy markets to avoid pickpockets. Drink only sealed bottled water.',
      customs: 'Remove shoes before entering temples. Dress modestly with shoulders and knees covered.',
      emergency: 'National Helpline: 112 · Police: 100 · Ambulance: 102',
      exchange: 'Carry cash for small vendors. Digital payments (UPI) are common but require local bank accounts; cards are accepted in hotels.',
      internet: 'Purchase a tourist SIM (Airtel or Jio) at airport arrivals using a passport copy.',
      simCards: 'Active in 24 hours. Keep passport photo handy for activation.',
      packing: 'Pack light, breathable cotton clothes. A light scarf is useful for covering heads at religious sites.',
      sockets: 'Type C, D & M sockets, 230V, 50Hz.'
    },
    aiQuestions: [
      'What should I wear to visit the Taj Mahal?',
      'Is it safe to drink tap water in Mumbai?',
      'How do I hire a private driver for Rajasthan?',
      'Explain the Ganga Aarti ceremony.'
    ]
  },
  france: {
    name: 'France',
    id: 'france',
    flag: '🇫🇷',
    tagline: 'Liberté, Égalité, Fraternité',
    quote: 'To know France is to know the art of living: coffee, painting, cheese, wine, and slow conversations.',
    heroImage: U('1502602898657-3e91760cbb34', 1920, 1080),
    facts: {
      weather: '12°C – 24°C (Spring/Summer)',
      currency: 'Euro (€)',
      language: 'French',
      timezone: 'GMT+1',
      visa: 'Schengen Visa Required',
      bestSeason: 'May – September'
    },
    about: {
      history: 'Spanning from Julius Caesar’s Roman Gaul and monarchical splendors of Louis XIV at Versailles to the French Revolution and Napoleon, France has shaped the course of Western philosophy, wars, and aesthetics.',
      culture: 'The birthplace of Impressionism, haute couture, cinema, and existentialist literature, where food is classified as UNESCO intangible heritage.',
      nature: 'Spans the snowy slopes of the French Alps, the purple lavender fields of Provence, and the sun-kissed sands of the French Riviera.',
      architecture: 'Includes Gothic Notre-Dame cathedrals, baroque royal châteaux, and Gustave Eiffel’s iron lattice tower.',
      people: 'Proud of their language and history, prioritizing work-life balance, dining etiquette, and intellectual debates.',
      whyLove: 'Tourists adore France for its romance, world-leading art galleries (Louvre, Musée d’Orsay), culinary arts, and diverse landscapes.'
    },
    natureShowcase: {
      title: 'Purple Lavender Hills & Glacial Peaks',
      desc: 'France is home to some of Western Europe’s most iconic geographical treasures. Wander the rolling hills of Provence, painted deep purple with lavender blossoms in mid-summer, scale the majestic snowy heights of Mont Blanc in Chamonix, or walk the rocky sea cliffs of Nice along the French Riviera.',
      images: [
        U('1500382017468-9049fed747ef'), // Provence fields
        U('1454496522488-7a8e488e8606'), // Mont Blanc Alps
        U('1512100356956-c1d4734aa6e2')  // French Riviera
      ]
    },
    experiences: [
      {
        title: 'Eiffel Tower Champagne Picnic',
        desc: 'Sip French champagne on the grassy lawn of Champ de Mars as the Eiffel Tower begins its glittering hourly light show at twilight.',
        duration: '2 hours',
        season: 'May – September',
        budget: '₹4,500',
        location: 'Paris',
        image: U('1431274172761-fca41d930114')
      },
      {
        title: 'Provence Lavender Trail',
        desc: 'Walk through endless rows of blooming purple lavender fields in Valensole, capturing the soothing aromas of summer.',
        duration: 'Half Day',
        season: 'Late June – Mid July',
        budget: '₹3,500',
        location: 'Provence',
        image: U('1500382017468-9049fed747ef')
      }
    ],
    places: [
      {
        name: 'The Eiffel Tower',
        rating: '4.8',
        desc: 'An iconic iron lattice tower on the Champ de Mars, named after engineer Gustave Eiffel.',
        location: 'Paris',
        duration: '2-3 Hours',
        category: 'Historic Monuments',
        image: U('1502602898657-3e91760cbb34'),
        gallery: [
          U('1502602898657-3e91760cbb34'),
          U('1431274172761-fca41d930114'),
          U('1499856871958-5b9647a64bc8')
        ],
        history: 'Built as the entrance arch for the 1889 World’s Fair, it was initially criticized by artists but has since become the ultimate global symbol of France.',
        facts: [
          'It is 330 meters tall, about the same height as an 81-story building.',
          'Shrinks by up to 15 cm during cold winters due to thermal contraction.',
          'Repainted by hand every seven years to prevent rusting.'
        ],
        nearby: ['Seine River Cruises', 'Arc de Triomphe', 'Louvre Museum'],
        restaurants: [
          { name: 'Le Jules Verne', style: 'Michelin French Dining inside Tower', rating: '4.8' }
        ],
        hotels: [
          { name: 'Hôtel Plaza Athénée', type: 'Palace Hotel with Tower Views', price: '₹98,000/night' }
        ],
        tips: [
          'Book tickets to the summit online months in advance. Stairs are cheaper and faster than elevators.',
          'Beware of pickpockets and petition-signer scammers near the tower base.'
        ],
        reviews: [
          { author: 'Pierre M.', rating: 5, comment: 'Seeing it sparkle at night is an unforgettable bucket-list experience.' }
        ]
      }
    ],
    gallery: [
      U('1502602898657-3e91760cbb34'),
      U('1431274172761-fca41d930114'),
      U('1500382017468-9049fed747ef'),
      U('1499856871958-5b9647a64bc8'),
      U('1507646227500-4d389b0012be'),
      U('1512100356956-c1d4734aa6e2')
    ],
    mapMarkers: [
      { name: 'Eiffel Tower', type: 'attraction', lat: 48.8584, lng: 2.2945, desc: 'World famous iron tower.' },
      { name: 'Louvre Museum', type: 'attraction', lat: 48.8606, lng: 2.3376, desc: 'Home of the Mona Lisa.' },
      { name: 'Palace of Versailles', type: 'attraction', lat: 48.8049, lng: 2.1204, desc: 'Baroque royal palace.' }
    ],
    regions: [
      { name: 'Paris', desc: 'The city of love, fashion, café terraces, and iconic museum galleries.', image: U('1502602898657-3e91760cbb34') },
      { name: 'French Riviera', desc: 'Glitzy azure coastline, yachts, pebble beaches, and film festivals.', image: U('1512100356956-c1d4734aa6e2') },
      { name: 'Loire Valley', desc: 'Fairy-tale royal châteaux scattered along a clean, winding river.', image: U('1507646227500-4d389b0012be') }
    ],
    food: [
      { name: 'Coq au Vin', type: 'Traditional', image: U('1600891964599-f61ba0e24092'), desc: 'Tender chicken braised slowly in red Burgundy wine, lardons, mushrooms, and fresh herbs.', bestRestaurant: 'Le Coq Rico (Paris)' },
      { name: 'Crêpes & Galettes', type: 'Street Food', image: U('1519676867240-f03562e64548'), desc: 'Sweet thin wheat pancakes or savory buckwheat pancakes filled with gruyère cheese and ham.', bestRestaurant: 'Breizh Café (Paris)' },
      { name: 'Macarons', type: 'Dessert', image: U('1569864358642-9d1684040f43'), desc: 'Delicate meringue-based sandwich confections with buttercream, ganache, or jam filling.', bestRestaurant: 'Ladurée (Paris)' },
      { name: 'Bordeaux Wine', type: 'Drink', image: U('1510812431401-41d2bd2722f3'), desc: 'World-renowned dry red wines produced in the historical vineyards of Bordeaux.', bestRestaurant: 'La Cité du Vin (Bordeaux)' }
    ],
    festivals: [
      { date: 'May', name: 'Cannes Film Festival', image: U('1512100356956-c1d4734aa6e2'), desc: 'The most prestigious international film festival gathering Hollywood and world stars on the Croisette.', travelAdvice: 'Book months in advance. Spot celebrities outside the Palais des Festivals.' }
    ],
    weatherData: [
      { month: 'Jan', temp: 5, rain: 50, humidity: 80 },
      { month: 'Feb', temp: 6, rain: 45, humidity: 78 },
      { month: 'Mar', temp: 9, rain: 40, humidity: 72 },
      { month: 'Apr', temp: 12, rain: 42, humidity: 65 },
      { month: 'May', temp: 16, rain: 55, humidity: 60 },
      { month: 'Jun', temp: 20, rain: 50, humidity: 58 },
      { month: 'Jul', temp: 23, rain: 48, humidity: 55 },
      { month: 'Aug', temp: 23, rain: 45, humidity: 57 },
      { month: 'Sep', temp: 19, rain: 52, humidity: 63 },
      { month: 'Oct', temp: 15, rain: 60, humidity: 70 },
      { month: 'Nov', temp: 9, rain: 58, humidity: 76 },
      { month: 'Dec', temp: 6, rain: 52, humidity: 80 }
    ],
    hotels: [
      { name: 'Hôtel Plaza Athénée', image: U('1566073771259-6a8506099945'), rating: '4.9', price: '₹95,000', amenities: ['Spa', 'Eiffel Views', 'Red Awnings Garden', 'Michelin Chef Restaurant'], location: 'Avenue Montaigne, Paris' },
      { name: 'Le Negresco', image: U('1584132967334-10e028bd69f7'), rating: '4.8', price: '₹68,000', amenities: ['Art Collection', 'Sea View Rooms', 'Private Beach Access'], location: 'Promenade des Anglais, Nice' }
    ],
    restaurants: [
      { name: 'L’Ambroisie', cuisine: 'Classic French haute cuisine', rating: '4.9', image: U('1550966871-3ed3cdb5ed0c'), hours: '12:00 – 13:45, 20:00 – 21:45', location: 'Place des Vosges, Paris' }
    ],
    transport: {
      flights: 'Paris Charles de Gaulle (CDG) and Orly (ORY) are the main international gateways.',
      metro: 'Paris Métro is extensive, efficient, and historic. Download the RATP app.',
      taxi: 'Available at taxi ranks or via taxi apps like G7 or Uber.',
      train: 'TGV high-speed rail connects Paris to Lyon, Marseille, Bordeaux, and European capitals in hours.',
      rental: 'Ideal for touring countryside wine regions like Burgundy or Loire. Manual cars are standard.',
      airportInfo: 'CDG is 25 km north of Paris, connected by RER B regional train (40 mins to city center).'
    },
    itineraries: [
      {
        days: '2 Days',
        title: 'Parisian Highlights',
        stops: [
          { day: 'Day 1', title: 'Museums and Tower', desc: 'Visit the Louvre Museum in the morning, walk the Seine banks, and watch the Eiffel Tower light up at night.' },
          { day: 'Day 2', title: 'Montmartre & Notre Dame', desc: 'Climb Montmartre hill to Sacré-Cœur, watch painters in Place du Tertre, and visit Notre Dame Cathedral area.' }
        ]
      },
      {
        days: '5 Days',
        title: 'Culture and Palaces',
        stops: [
          { day: 'Day 1-2', title: 'Paris Art Scenes', desc: 'Explore Musée d’Orsay, take a boat cruise, and dine in Saint-Germain-des-Prés.' },
          { day: 'Day 3', title: 'Versailles Royal Day', desc: 'Take the RER train to Versailles. Tour the Hall of Mirrors and grand gardens.' },
          { day: 'Day 4-5', title: 'Loire Valley Castles', desc: 'Rent a car and travel to Loire Valley. Visit Château de Chambord and wine cellars.' }
        ]
      }
    ],
    budgetEstimator: {
      budget: 10500,
      mid: 22000,
      luxury: 75000
    },
    tips: {
      safety: 'Watch out for pickpockets on crowded subways (especially line 1 and 4) and near tourist sites.',
      customs: 'Always greet shopkeepers with a polite "Bonjour" before asking questions. It is key to good service.',
      emergency: 'General Emergency: 112 · Police: 17 · Medical: 15',
      exchange: 'Credit cards are accepted almost everywhere, including bakeries for a 1€ baguette.',
      internet: 'Free WiFi is available in public parks and cafés. Pre-purchasing eSIM is highly practical.',
      simCards: 'Orange Holiday and Free Mobile offer generous prepaid tourist packs.',
      packing: 'Comfortable walking shoes are vital for cobblestone streets. Bring chic, smart-casual clothes.',
      sockets: 'Type C & E sockets, 230V, 50Hz.'
    },
    aiQuestions: [
      'What are the Louvre Museum opening hours?',
      'How does the Paris subway ticket work?',
      'Best day trip from Paris by train?',
      'What is French café etiquette?'
    ]
  }
};

// Auto generator for other countries to prevent any broken details pages
const GENERATED_COUNTRIES_CACHE = {};

export function getCountryDetails(countryId) {
  const normalizedId = countryId.toLowerCase().replace(/\s+/g, '-');
  
  // Return static high fidelity configuration if available
  if (COUNTRY_STATIC_DETAILS[normalizedId]) {
    return COUNTRY_STATIC_DETAILS[normalizedId];
  }
  
  // Return cached generated country details if available
  if (GENERATED_COUNTRIES_CACHE[normalizedId]) {
    return GENERATED_COUNTRIES_CACHE[normalizedId];
  }

  // Capitalize name cleanly
  const name = countryId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Dynamically generate premium details on the fly
  const generatedDetails = {
    name,
    id: normalizedId,
    flag: '🌍',
    tagline: `Discover the wonders of ${name}`,
    quote: `Travel makes one modest. You see what a tiny place you occupy in the world. Welcome to ${name}.`,
    heroImage: U('1469854523086-cc02fe5d8800', 1920, 1080), // Generic travel hero photo
    facts: {
      weather: '15°C – 28°C (Seasonal)',
      currency: `Local Currency`,
      language: 'Official Language',
      timezone: 'GMT+0',
      visa: 'Visa on Arrival / eVisa available',
      bestSeason: 'Spring and Autumn months'
    },
    about: {
      history: `From ancient roots and rich regional heritage to modern independent growth, ${name}’s history is a compelling story of culture, trade routes, and societal evolution.`,
      culture: `A beautiful blend of local traditions, music, visual arts, and family values that reflect the warm character of the country.`,
      nature: `Diverse natural ecosystems, ranging from picturesque countryside walks and coastal beaches to national parks rich with flora and fauna.`,
      architecture: `A captivating mix of heritage buildings, regional historic structures, and modern urban planning that tells the story of the nation’s growth.`,
      people: `Renowned for their welcoming hospitality, traditional values, and a strong sense of community.`,
      whyLove: `Travellers are drawn to ${name} for its unique cultural identity, untouched scenic spots, local cuisines, and the warm smiles of the local residents.`
    },
    natureShowcase: {
      title: `Untouched Wildscapes of ${name}`,
      desc: `Discover the pure, pristine geography of ${name}. Walk along quiet trails, discover hidden waterfalls, and admire the sweeping landscape vistas that define the scenic wonders of this region.`,
      images: [
        U('1470071459604-3b5ec3a7fe05'), // mountain lake
        U('1447752875215-b2761acb3c5d'), // forest road
        U('1507525428034-b723cf961d3e')  // ocean coast
      ]
    },
    experiences: [
      {
        title: 'Local Cultural & Heritage Guided Tour',
        desc: `Join a local historian to walk through the ancient avenues and monuments that defined ${name}'s national identity.`,
        duration: '3 hours',
        season: 'Year-Round',
        budget: '₹2,500',
        location: name,
        image: U('1476514525535-07fb3b4ae5f1')
      },
      {
        title: 'Panoramic Nature & Wildlife Trek',
        desc: `Hike up the scenic trails of the national reserves to witness sweeping views and native wildlife.`,
        duration: 'Half Day',
        season: 'Best Season',
        budget: '₹1,800',
        location: 'National Park',
        image: U('1447752875215-b2761acb3c5d')
      }
    ],
    places: [
      {
        name: `Historic Old Town of ${name}`,
        rating: '4.7',
        desc: `Explore the winding streets, local artisan shops, and heritage architectures in the historic center.`,
        location: name,
        duration: '2-4 Hours',
        category: 'Heritage Center',
        image: U('1533105079780-92b9be482077'),
        gallery: [
          U('1533105079780-92b9be482077'),
          U('1476514525535-07fb3b4ae5f1'),
          U('1447752875215-b2761acb3c5d')
        ],
        history: `Originally established centuries ago as a merchant trading crossroads, the district houses preserved artifacts and monuments documenting the early foundation of ${name}.`,
        facts: [
          'Added to national registry of historic monuments.',
          'Entirely pedestrian-friendly brick walkways.',
          'Houses small family museums detailing local crafts.'
        ],
        nearby: ['Central Plaza', 'National Museum', 'Riverside Walk'],
        restaurants: [
          { name: 'Heritage Café', style: 'Traditional Bites & Drinks', rating: '4.6' }
        ],
        hotels: [
          { name: `The Grande ${name} Hotel`, type: 'Premium City Lodging', price: '₹18,000/night' }
        ],
        tips: [
          'Start your walk in the late afternoon for beautiful sunset lighting.',
          'Carry local cash as small independent craft vendors do not accept cards.'
        ],
        reviews: [
          { author: 'David L.', rating: 5, comment: `Gorgeous architectures. The local pastries here are must-tries!` }
        ]
      }
    ],
    gallery: [
      U('1469854523086-cc02fe5d8800'),
      U('1476514525535-07fb3b4ae5f1'),
      U('1447752875215-b2761acb3c5d'),
      U('1533105079780-92b9be482077'),
      U('1507525428034-b723cf961d3e'),
      U('1454496522488-7a8e488e8606')
    ],
    mapMarkers: [
      { name: 'City Center Monument', type: 'attraction', lat: 0, lng: 0, desc: 'Central historic square.' },
      { name: 'National Park Entrance', type: 'attraction', lat: 0.05, lng: -0.05, desc: 'Scenic mountain trail hub.' },
      { name: 'The Royal Inn', type: 'hotel', lat: -0.02, lng: 0.02, desc: 'Luxury boutique lodging.' }
    ],
    regions: [
      { name: 'Capital District', desc: 'The bustling cultural, financial, and political heart of the nation.', image: U('1477959858617-67f85cf4f1df') },
      { name: 'Coastal Province', desc: 'Sandy coastlines, fishing villages, and fresh seafood dining.', image: U('1507525428034-b723cf961d3e') },
      { name: 'Highlands & Peaks', desc: 'Cool mountain air, green valleys, and adventure hiking trails.', image: U('1454496522488-7a8e488e8606') }
    ],
    food: [
      { name: 'Signature National Platter', type: 'Traditional', image: U('1504674900247-0877df9cc836'), desc: 'A rich combination of locally harvested grains, roasted meats, and traditional spices.', bestRestaurant: 'Local Tavern' },
      { name: 'Savory Handheld Street Pastry', type: 'Street Food', image: U('1541532713592-79a0317b6b77'), desc: 'Flaky baked dough pockets stuffed with spiced vegetables or minced meats.', bestRestaurant: 'Bazaar Stalls' }
    ],
    festivals: [
      { date: 'Varies Monthly', name: 'National Heritage Festival', image: U('1533105079780-92b9be482077'), desc: 'An annual celebration showcasing traditional outfits, music stages, and massive outdoor banquets.', travelAdvice: 'Check local calendar dates and pack light cotton garments.' }
    ],
    weatherData: [
      { month: 'Jan', temp: 8, rain: 60, humidity: 65 },
      { month: 'Feb', temp: 10, rain: 50, humidity: 62 },
      { month: 'Mar', temp: 14, rain: 45, humidity: 55 },
      { month: 'Apr', temp: 18, rain: 40, humidity: 50 },
      { month: 'May', temp: 22, rain: 35, humidity: 48 },
      { month: 'Jun', temp: 26, rain: 30, humidity: 45 },
      { month: 'Jul', temp: 29, rain: 25, humidity: 45 },
      { month: 'Aug', temp: 28, rain: 30, humidity: 48 },
      { month: 'Sep', temp: 24, rain: 50, humidity: 55 },
      { month: 'Oct', temp: 18, rain: 55, humidity: 60 },
      { month: 'Nov', temp: 13, rain: 65, humidity: 65 },
      { month: 'Dec', temp: 9, rain: 70, humidity: 68 }
    ],
    hotels: [
      { name: 'The Plaza Suite', image: U('1566073771259-6a8506099945'), rating: '4.6', price: '₹14,500', amenities: ['WiFi', 'Breakfast', 'Gym'], location: 'City Center' }
    ],
    restaurants: [
      { name: 'The Green Garden', cuisine: 'Local Delicacies', rating: '4.5', image: U('1550966871-3ed3cdb5ed0c'), hours: '12:00 – 22:00', location: 'Downtown' }
    ],
    transport: {
      flights: `Main aviation routes arrive at the primary international airport in the capital city.`,
      metro: 'Bus networks and urban tram lines connect city areas effectively.',
      taxi: 'Ride-sharing apps and registered street taxis operate in central areas.',
      train: 'Railways connect key provinces; bookings can be made online in advance.',
      rental: 'Car rental services are available with valid international drivers licenses.',
      airportInfo: 'The main international airport is situated around 20 km outside the city center.'
    },
    itineraries: [
      {
        days: '3 Days',
        title: 'Essential Discovery Tour',
        stops: [
          { day: 'Day 1', title: 'Arrival & City Walk', desc: 'Check in, visit the central squares, and dine at a traditional local bistro.' },
          { day: 'Day 2', title: 'Nature Exploration', desc: 'Take a guided nature excursion to the nearby scenic hills and rivers.' },
          { day: 'Day 3', title: 'Museums & Craft Markets', desc: 'Explore historical exhibitions, buy local souvenirs, and depart.' }
        ]
      }
    ],
    budgetEstimator: {
      budget: 3500,
      mid: 8500,
      luxury: 22000
    },
    tips: {
      safety: `Very hospitable, but watch personal items in crowded public markets.`,
      customs: 'A friendly wave and greeting goes a long way. Respect local dress codes at historical sites.',
      emergency: 'Police: 112 / 911 equivalents',
      exchange: 'Exchange cash at official counters. Cards are accepted at major outlets, but carry cash for smaller shops.',
      internet: 'Local SIM cards are easily bought at airport stalls.',
      simCards: 'Ensure phone is unlocked before purchase.',
      packing: 'Layered clothing is best to adjust for changing outdoor temperatures.',
      sockets: 'Standard type G/C sockets, 220V.'
    },
    aiQuestions: [
      `What are the visa requirements for ${name}?`,
      `What is the best month to travel to ${name}?`,
      `Recommend local traditional foods to try in ${name}.`,
      `Draft a quick 3-day itinerary for ${name}.`
    ]
  };

  // Cache generated data to make subsequent renders instant
  GENERATED_COUNTRIES_CACHE[normalizedId] = generatedDetails;
  return generatedDetails;
}
