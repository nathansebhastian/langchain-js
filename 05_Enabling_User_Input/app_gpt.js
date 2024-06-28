import { ChatOpenAI } from '@langchain/openai';
import prompts from 'prompts';

import 'dotenv/config';

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  openAIApiKey: process.env.OPENAI_KEY,
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
