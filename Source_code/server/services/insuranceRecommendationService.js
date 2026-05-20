import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateInsuranceRecommendation(userProfile) {
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

  const prompt = `
    Based on the following user profile, provide insurance recommendations:
    ${JSON.stringify(userProfile, null, 2)}
    
    Please provide recommendations for:
    1. Life Insurance
    2. Health Insurance
    3. Property Insurance
    4. Auto Insurance (if applicable)
    
    Format your response as a JSON object with these keys: lifeInsurance, healthInsurance, propertyInsurance, autoInsurance.
    Each should contain an object with 'recommendation' and 'explanation' fields.
    Do not include any markdown formatting in your response.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Remove any potential markdown formatting 
    const cleanedText = text.replace(/```json|```/g, '').trim();
    
    // Parse the cleaned JSON
    const recommendations = JSON.parse(cleanedText);
    
    return recommendations;
  } catch (error) {
    console.error("Error generating insurance recommendation:", error);
    throw error;
  }
}