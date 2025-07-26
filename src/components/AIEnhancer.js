export const enhanceWithAI = async (text, type = "summary") => {
    if (!text?.trim()) return "";
    const openAIKey = process.env.REACT_APP_AI;
    const prompt =
      type === "summary"
        ? `Make the following professional summary more crisp, engaging, and professional for a resume and must have atleast 50 words:\n\n"${text}"`
        : `Convert the following job responsibilities into at least 4 concise, impactful, and professional bullet points suitable for a resume. Each point should be short, action-oriented, and easy to read.:\n\n"${text}"`;
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });
  
      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || "";
    } catch (err) {
      console.error("AI enhancement failed:", err);
      return "";
    }
  };
  