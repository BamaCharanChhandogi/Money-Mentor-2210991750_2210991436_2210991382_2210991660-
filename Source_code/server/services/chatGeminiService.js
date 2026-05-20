import {GoogleGenerativeAI} from "@google/generative-ai";

export async function getFinancialAdvice(userContext, userMessage) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const prompt = `
You are an AI financial advisor. Use the following user context to provide personalized financial advice:

${JSON.stringify(userContext, null, 2)}

User question: ${userMessage}

Provide a concise, helpful response addressing the user's question and considering their financial situation. 
If the question is not related to finance, politely redirect the conversation to financial topics.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in chatbot getFinancialAdvice:", error);
    if (error.status === 429) {
      return "I'm currently receiving too many requests. Please wait a moment and try again.";
    }
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
};