const AiChat = require('../models/AiChat');
const AiItinerary = require('../models/AiItinerary');
const AiBudget = require('../models/AiBudget');
const AiRecommendation = require('../models/AiRecommendation');
const Trip = require('../models/Trip');
const aiService = require('../services/ai.service');

/**
 * 1. AI Chatbot Assistant with history persistence & context awareness
 */
exports.chatWithAI = async (req, res, next) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Retrieve last 10 messages for conversational memory
    const history = await AiChat.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    const formattedHistory = history.reverse().map(c => 
      `User: ${c.message}\nAssistant: ${c.reply}`
    ).join('\n\n');

    const systemInstruction = `You are Traveloop Assistant, a premium AI travel agent and guide.
Provide highly personalized, helpful, concise, and inspiring travel advice.
Format your responses using clean Markdown.
Use bolding, bullet points, headers, or tables where appropriate to present travel info beautifully.
If the user asks questions about their trips, refer to their active context.

Active User Context:
${JSON.stringify(context || {})}

Previous Conversation History:
${formattedHistory || 'No previous messages.'}`;

    const reply = await aiService.generateText(message, systemInstruction);

    // Persist in MongoDB
    const chatLog = await AiChat.create({
      userId: req.user.id,
      message,
      reply
    });

    res.status(200).json(chatLog);
  } catch (error) {
    next(error);
  }
};

/**
 * Get AI chat history
 */
exports.getChatHistory = async (req, res, next) => {
  try {
    const history = await AiChat.find({ userId: req.user.id })
      .sort({ createdAt: 1 });
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};

/**
 * Clear AI chat history
 */
exports.clearChatHistory = async (req, res, next) => {
  try {
    await AiChat.deleteMany({ userId: req.user.id });
    res.status(200).json({ success: true, message: 'Chat history cleared successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. AI Itinerary Generator
 */
exports.generateItinerary = async (req, res, next) => {
  try {
    const { destination, budget, days, interests, travelStyle, groupType } = req.body;
    if (!destination || !budget || !days) {
      return res.status(400).json({ message: 'Destination, budget, and days are required' });
    }

    const prompt = `Create a realistic travel itinerary for:
Destination: ${destination}
Number of days: ${days} days
Estimated total budget: INR ${budget}
Interests: ${Array.isArray(interests) ? interests.join(', ') : (interests || 'Sightseeing, food')}
Travel Style: ${travelStyle || 'Standard'}
Group Type: ${groupType || 'Solo'}

Format the output as a valid JSON object. Do not wrap the JSON in markdown code blocks.
The JSON object must have exactly this structure:
{
  "tripName": "AI planned trip name",
  "totalEstimatedCost": number (realistic total estimated cost in INR),
  "generalOptimization": "General tip for travel safety and route efficiency in this city",
  "days": [
    {
      "day": 1,
      "theme": "Day theme (e.g. Exploring historical landmarks)",
      "morning": {
        "activity": "Activity name",
        "description": "Short compelling details"
      },
      "afternoon": {
        "activity": "Activity name",
        "description": "Short compelling details"
      },
      "evening": {
        "activity": "Activity name",
        "description": "Short compelling details"
      },
      "foodSuggestions": ["restaurant/dish suggestion 1", "restaurant/dish suggestion 2"],
      "estimatedCost": number (realistic daily estimated cost in INR),
      "optimizationTip": "Tip for this day (e.g. walk between sights to save cost)"
    }
  ]
}`;

    const systemInstruction = "You are a professional travel planner. Generate structured day-by-day itineraries matching the requested JSON schema. Ensure costs are realistic and fit within the user's budget range.";
    const resultJson = await aiService.generateJSON(prompt, systemInstruction);

    // Save in DB
    const savedItinerary = await AiItinerary.create({
      userId: req.user.id,
      destination,
      budget,
      days,
      interests: Array.isArray(interests) ? interests : [interests],
      travelStyle,
      groupType,
      itinerary: resultJson
    });

    res.status(200).json(savedItinerary);
  } catch (error) {
    next(error);
  }
};

/**
 * 3. AI Budget Planner
 */
exports.generateBudget = async (req, res, next) => {
  try {
    const { destination, days, budgetType } = req.body;
    if (!destination || !days || !budgetType) {
      return res.status(400).json({ message: 'Destination, days, and budgetType are required' });
    }

    const prompt = `Generate a realistic travel budget breakdown for:
Destination: ${destination}
Duration: ${days} days
Type: ${budgetType} (Budget, Standard, or Luxury)

Format the output as a valid JSON object. Do not wrap the JSON in markdown code blocks.
The JSON object must have exactly this structure:
{
  "hotel": number (total hotel costs in INR),
  "food": number (total food expenses in INR),
  "transport": number (total transport costs in INR),
  "activities": number (total activity expenses in INR),
  "buffer": number (emergency buffer in INR),
  "shopping": number (shopping budget in INR),
  "total": number (sum of all expenses in INR),
  "currency": "INR",
  "reasoning": "A paragraph explaining the pricing, season impact, and cost-saving tips for this tier.",
  "dailyBreakdown": [
    {
      "day": number (e.g. 1),
      "spent": number (total spent on this day),
      "hotel": number,
      "food": number,
      "other": number
    }
  ]
}`;

    const systemInstruction = "You are a travel finance analyst. Generate realistic budget estimations tailored specifically to the destination and requested travel tier (Budget, Standard, Luxury).";
    const resultJson = await aiService.generateJSON(prompt, systemInstruction);

    // Save in DB
    const savedBudget = await AiBudget.create({
      userId: req.user.id,
      destination,
      days,
      budgetType,
      budgetEstimation: resultJson
    });

    res.status(200).json(savedBudget);
  } catch (error) {
    next(error);
  }
};

/**
 * 4. AI Destination Recommendation Engine
 */
exports.recommendDestinations = async (req, res, next) => {
  try {
    const { budget, weather, interests, season, adventureLevel, groupType } = req.body;

    const prompt = `Recommend exactly 3 suitable destinations based on these travel preferences:
- Budget limit: INR ${budget || 'flexible'}
- Preferred Weather: ${weather || 'any'}
- Interests: ${Array.isArray(interests) ? interests.join(', ') : (interests || 'any')}
- Travel Season: ${season || 'any'}
- Adventure Level: ${adventureLevel || 'Moderate'} (Low, Moderate, High)
- Travel Group: ${groupType || 'Solo'}

Format the output as a valid JSON object. Do not wrap the JSON in markdown code blocks.
The JSON object must have exactly this structure:
{
  "destinations": [
    {
      "name": "City/Region name",
      "country": "Country name",
      "matchPercentage": number (e.g. 95),
      "whyIdeal": "Explanation of why this destination matches their interests, weather preference, and group type",
      "bestTimeToVisit": "Best months to visit",
      "estimatedDailyCost": number (realistic daily cost in INR),
      "weatherForecast": "Typical weather during their requested season",
      "activityHighlights": ["Activity 1", "Activity 2", "Activity 3"]
    }
  ]
}`;

    const systemInstruction = "You are a destination matching engine. Analyze the preferences and suggest cities globally or locally that fit the exact criteria.";
    const resultJson = await aiService.generateJSON(prompt, systemInstruction);

    const savedRec = await AiRecommendation.create({
      userId: req.user.id,
      type: 'destination',
      inputs: { budget, weather, interests, season, adventureLevel, groupType },
      results: resultJson
    });

    res.status(200).json(savedRec);
  } catch (error) {
    next(error);
  }
};

/**
 * 5. AI Hotel Recommendation
 */
exports.recommendHotels = async (req, res, next) => {
  try {
    const { destination, budget, preferences, nearbyAttractions } = req.body;
    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }

    const prompt = `Recommend 3 hotels/accommodations in ${destination} matching:
- User Budget Level: ${budget || 'Standard'}
- User Preferences: ${preferences || 'Wi-Fi, Clean rooms'}
- Location near to: ${nearbyAttractions || 'Center of town'}

Format the output as a valid JSON object. Do not wrap the JSON in markdown code blocks.
The JSON object must have exactly this structure:
{
  "hotels": [
    {
      "name": "Hotel name",
      "rating": number (e.g. 4.5),
      "priceRange": "Price range in INR per night (e.g. ₹3,000 - ₹5,000)",
      "description": "Short overview of the property",
      "recommendationReason": "AI reason why this matches their preferences, safety standards, or location proximity",
      "nearbyAttractions": ["Attraction 1", "Attraction 2"],
      "amenities": ["Amenity 1", "Amenity 2", "Amenity 3"]
    }
  ]
}`;

    const systemInstruction = "You are a hotel recommendation assistant. Suggest realistic hotels (could be real or representative) with accurate ratings, amenities, and strong reasons for selection.";
    const resultJson = await aiService.generateJSON(prompt, systemInstruction);

    const savedRec = await AiRecommendation.create({
      userId: req.user.id,
      type: 'hotel',
      inputs: { destination, budget, preferences, nearbyAttractions },
      results: resultJson
    });

    res.status(200).json(savedRec);
  } catch (error) {
    next(error);
  }
};

/**
 * 6. Smart Packing Assistant
 */
exports.generatePackingList = async (req, res, next) => {
  try {
    const { destination, duration, activities, season } = req.body;
    if (!destination || !duration) {
      return res.status(400).json({ message: 'Destination and duration are required' });
    }

    const prompt = `Generate a comprehensive packing checklist for:
Destination: ${destination}
Duration: ${duration} days
Activities: ${activities || 'general sightseeing'}
Season/Weather: ${season || 'mild'}

Format the output as a valid JSON object. Do not wrap the JSON in markdown code blocks.
The JSON object must have exactly this structure:
{
  "packingList": {
    "clothes": [
      { "item": "item name", "qty": "quantity/count" }
    ],
    "electronics": [
      { "item": "item name", "qty": "quantity/count" }
    ],
    "essentials": [
      { "item": "item name", "qty": "quantity/count" }
    ],
    "medical": [
      { "item": "item name", "qty": "quantity/count" }
    ],
    "documents": [
      { "item": "item name", "qty": "quantity/count" }
    ]
  }
}`;

    const systemInstruction = "You are a packing expert. Generate customized, logical packing lists depending on weather conditions, activity levels, and durations.";
    const resultJson = await aiService.generateJSON(prompt, systemInstruction);

    res.status(200).json(resultJson);
  } catch (error) {
    next(error);
  }
};

/**
 * 7. AI Trip Optimizer
 */
exports.optimizeTrip = async (req, res, next) => {
  try {
    const { tripId, stops } = req.body;
    let stopsToOptimize = stops || [];

    if (tripId) {
      const trip = await Trip.findOne({ _id: tripId, userId: req.user.id });
      if (trip) {
        stopsToOptimize = trip.stops.map(s => ({
          city: s.city,
          country: s.country,
          dateFrom: s.dateFrom,
          dateTo: s.dateTo,
          activities: s.activities.map(a => a.name)
        }));
      }
    }

    if (stopsToOptimize.length === 0) {
      return res.status(400).json({ message: 'Stops list or active tripId with stops is required' });
    }

    const prompt = `Optimize the following travel stops for route efficiency, cost-minimization, and time management:
${JSON.stringify(stopsToOptimize)}

Format the output as a valid JSON object. Do not wrap the JSON in markdown code blocks.
The JSON object must have exactly this structure:
{
  "optimizedRoute": ["Ordered City name 1", "Ordered City name 2"],
  "savingsEstimation": "Short summary of potential cost savings (e.g. Save ₹5,000 in fuel/tickets)",
  "improvements": [
    "Specific improvement tip 1 (e.g. Reordering prevents doubling back between City A and C)",
    "Specific improvement tip 2"
  ],
  "detailedSuggestions": "A paragraph with route explanation and recommendations on local transport."
}`;

    const systemInstruction = "You are a travel logistics optimizer. Reorder stops to create the most linear and cost-efficient path. Suggest realistic transportation methods between stops.";
    const resultJson = await aiService.generateJSON(prompt, systemInstruction);

    res.status(200).json(resultJson);
  } catch (error) {
    next(error);
  }
};

/**
 * 8. AI Analytics Dashboard
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    // 1. Fetch user records
    const trips = await Trip.find({ userId: req.user.id });
    const budgets = await AiBudget.find({ userId: req.user.id });
    const itineraries = await AiItinerary.find({ userId: req.user.id });
    const recommendations = await AiRecommendation.find({ userId: req.user.id });

    // 2. Perform basic calculations
    const totalTrips = trips.length;
    const totalBudgetsGenerated = budgets.length;
    
    let sumBudgetLimit = 0;
    trips.forEach(t => {
      sumBudgetLimit += (t.budgetLimit || 0);
    });
    const avgBudgetLimit = totalTrips > 0 ? Math.round(sumBudgetLimit / totalTrips) : 0;

    // Aggregate spending categories across trips
    const spendingCategories = {};
    trips.forEach(t => {
      t.expenses.forEach(e => {
        spendingCategories[e.category] = (spendingCategories[e.category] || 0) + e.amount;
      });
    });

    // 3. Prompt AI to give custom insights
    const statsSummary = {
      totalTrips,
      avgBudgetLimit,
      totalBudgetsGenerated,
      recentDestinations: trips.map(t => t.stops.map(s => s.city)).flat(),
      spendingBreakdown: spendingCategories
    };

    const prompt = `Analyze my travel profile statistics and provide 3 brief, actionable, personalized travel insights or suggestions.
User Profile Statistics:
${JSON.stringify(statsSummary)}

Format the output as a valid JSON object. Do not wrap the JSON in markdown code blocks.
The JSON object must have exactly this structure:
{
  "insights": [
    "Insight 1 (e.g. You travel frequently to warm destinations; consider spring to avoid seasonal premium pricing.)",
    "Insight 2",
    "Insight 3"
  ],
  "popularDestinations": [
    { "name": "Tokyo", "count": 25 },
    { "name": "Paris", "count": 18 },
    { "name": "Bali", "count": 15 },
    { "name": "Goa", "count": 12 },
    { "name": "New York", "count": 10 }
  ],
  "userTravelTrends": [
    { "month": "Jan", "trips": 1, "budget": 12000 },
    { "month": "Mar", "trips": 2, "budget": 35000 },
    { "month": "May", "trips": 1, "budget": 18000 },
    { "month": "Jul", "trips": 0, "budget": 0 },
    { "month": "Sep", "trips": 1, "budget": 22000 },
    { "month": "Nov", "trips": 3, "budget": 45000 }
  ]
}`;

    const systemInstruction = "You are a travel statistics auditor. Generate smart, personalized tips and trend breakdowns based on user travel data.";
    const resultJson = await aiService.generateJSON(prompt, systemInstruction);

    // Merge calculated stats
    const responsePayload = {
      tripsCount: totalTrips,
      averageBudget: avgBudgetLimit,
      budgetsCount: totalBudgetsGenerated,
      recommendationsCount: recommendations.length,
      itinerariesCount: itineraries.length,
      categoryExpenses: Object.entries(spendingCategories).map(([name, value]) => ({ name, value })),
      aiInsights: resultJson.insights,
      popularDestinations: resultJson.popularDestinations,
      userTravelTrends: resultJson.userTravelTrends
    };

    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

/**
 * 9. AI Activities Generator
 */
exports.generateActivities = async (req, res, next) => {
  try {
    const { city, duration } = req.body;
    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }

    const prompt = `Generate a list of 5 activities for the city of ${city} over a duration of ${duration || '2 days'}.
Format the output as a valid JSON array of objects. Do not wrap the JSON in markdown code blocks.
Each object must have exactly this structure:
[
  {
    "name": "Activity Name",
    "description": "Short description of the activity",
    "duration": "Duration (e.g. 2.5h)",
    "cost": number (estimated cost in INR, e.g. 500),
    "type": "Activity Type (e.g. Sightseeing, Culture, Food, Relaxation, Adventure, Nightlife)"
  }
]`;

    const systemInstruction = "You are a local travel guide. Generate a structured JSON list of 5 activities for the requested city.";
    const resultJson = await aiService.generateJSON(prompt, systemInstruction);

    res.status(200).json(resultJson);
  } catch (error) {
    next(error);
  }
};

