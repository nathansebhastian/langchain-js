import { ChatOllama } from '@langchain/community/chat_models/ollama';

const llm = new ChatOllama({
  model: 'mistral',
});

console.log('Q & A With AI');
console.log('=============');

const question = "What's the currency of Thailand?";
console.log(`Question: ${question}`);

const response = await llm.invoke(question);
console.log(`Answer: ${response.content}`);
