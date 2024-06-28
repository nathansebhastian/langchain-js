import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

import 'dotenv/config';

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-pro-latest',
  apiKey: process.env.GOOGLE_GEMINI_KEY,
});

console.log('Q & A With AI');
console.log('=============');

const question = "What's the currency of Thailand?";
console.log(`Question: ${question}`);

const response = await llm.invoke(question);
console.log(`Answer: ${response.content}`);
