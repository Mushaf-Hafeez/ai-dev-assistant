import Groq from "groq-sdk";

import "dotenv/config";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const askQuestion = async (vectorStore, question) => {
  try {
    const results = await vectorStore.similaritySearch(question, 2);
    const releventContext = results
      .map((result) => result.pageContent)
      .join("\n\n");

    console.log(releventContext);

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `You are a personal assistant. You have to answer the questions that you were asked. The answer should be precise, in plain english (not in makrdown syntax) and to the point that can be easily understandable and from the relevantContext and not from any other source. if the questin if out the the relevant context then just respond politely that I don't know.
          
          releventContext: ${releventContext}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.log("Error in the askQuestion function: ", error.message);
  }
};
