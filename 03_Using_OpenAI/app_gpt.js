import { ChatOpenAI } from '@langchain/openai';

import 'dotenv/config';

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  openAIApiKey: process.env.OPENAI_KEY,
});

console.log('Q & A With AI');
console.log('=============');

const question = "What's the currency of Thailand?";
console.log(`Question: ${question}`);

const response = await llm.invoke(question);
console.log(`Answer: ${response.content}`);
