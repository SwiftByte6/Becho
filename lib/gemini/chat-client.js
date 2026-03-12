import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_CHAT_API_KEY);

export const geminiChat = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});
