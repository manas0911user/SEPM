import Groq from "groq-sdk";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: message },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};