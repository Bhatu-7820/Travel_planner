const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generateActivities = async (req, res, next) => {
  try {
    const { city, duration, interests } = req.body;
    if (!city) return res.status(400).json({ message: 'City is required' });
    
    const prompt = `Generate a realistic JSON array of exactly 5 travel activities for someone visiting ${city}.
    The duration of stay is around ${duration || 'a few days'}.
    Interests: ${interests || 'general sightseeing, culture, food'}.
    Format the output as a valid JSON array of objects, with no markdown formatting around it.
    Each object must have exactly these keys:
    "name": string (activity name)
    "type": string (e.g. "Sightseeing", "Food", "Adventure", "Culture", "Relaxation")
    "cost": number (realistic estimated cost in Indian Rupees (INR/₹) as a pure number, no currency symbol. Use 0 if free)
    "duration": string (e.g. "2h", "4h", "1d")
    "description": string (short compelling description)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    let activities = [];
    try {
      activities = JSON.parse(text);
    } catch (e) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) activities = JSON.parse(match[1]);
      else activities = JSON.parse(text.trim());
    }
    
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};

exports.chatWithAI = async (req, res, next) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const prompt = `You are Traveloop Assistant, a premium AI travel agent.
    User context: ${JSON.stringify(context || {})}
    User message: ${message}
    
    Provide helpful, concise, and inspiring travel advice. Keep formatting clean.`;

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.status(200).json({ reply: responseText });
  } catch (error) {
    next(error);
  }
};
