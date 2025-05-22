import groqClient from "../config/groqConfig";

const getAiResponse = async (prompt: string) => {
  try {
    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192",
    });

    const aiResponse = chatCompletion.choices[0].message.content;

    return aiResponse;
  } catch (error) {
    throw error;
  }
};
