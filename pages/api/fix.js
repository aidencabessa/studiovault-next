export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: req.body.system }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: req.body.messages[0].content }]
            }
          ],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 4096,
          }
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      return res.status(response.status).json({ error: errBody });
    }

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    // Extract text from Gemini response format
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Return in Anthropic-compatible shape so frontend works unchanged
    return res.status(200).json({
      content: [{ type: "text", text }]
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
