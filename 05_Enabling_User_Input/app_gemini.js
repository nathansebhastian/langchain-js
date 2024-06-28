import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import prompts from 'prompts';

import 'dotenv/config';

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-pro-latest',
  apiKey: process.env.GOOGLE_GEMINI_KEY,
});

console.log('Q & A With AI');
console.log('=============');
console.log('Type /bye to stop the program');

let exit = false;
while (!exit) {
  const { question } = await prompts({
    type: 'text',
    name: 'question',
    message: 'Your question: ',
    validate: value => (value ? true : 'Question cannot be empty'),
  });
  if (question == '/bye') {
    console.log('See you later!');
    exit = true;
  } else {
    const response = await llm.invoke(question);
    console.log(response.content);
  }
}
