import axios from "axios";

const GEMINI_API_KEY = "AIzaSyCRymUERA_7lw-bUvsQTu0x4Gg4IP2NLR8";

export const travelChatbot = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { city, days } = req.body;

  if (!city || city.trim() === "") {
    return res.status(400).json({ error: "City name is required" });
  }

  if (!days || isNaN(days) || days <= 0) {
    return res.status(400).json({ error: "Number of days is required and must be a positive number" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a smart travel recommendation assistant.  
The user will give a city name and the number of days they plan to stay.  
You must respond with a **day-wise itinerary**, dividing attractions, cultural spots, food streets, and local tips evenly across the days.  
Format your answer with bullet points under **Day 1, Day 2, ..., Day ${days}**.

City: ${city}  
Number of days: ${days}  
Keep it concise, engaging, and ready-to-use for travelers.
            `,
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      payload,
      { headers: { "Content-Type": "application/json" }, signal: controller.signal }
    );

    clearTimeout(timeout);

    const answer = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) return res.status(500).json({ error: "Empty response from Gemini" });

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Gemini API failed" });
  }
};
