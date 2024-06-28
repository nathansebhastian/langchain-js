import { ChatOllama } from '@langchain/community/chat_models/ollama';
import prompts from 'prompts';

const llm = new ChatOllama({
  model: 'mistral',
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
