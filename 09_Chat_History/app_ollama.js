import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { ChatMessageHistory } from 'langchain/memory';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';

import prompts from 'prompts';

const llm = new ChatOllama({
  model: 'mistral',
});

const history = new ChatMessageHistory();

const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are an AI chatbot having a conversation with a human. 
     Use the following context to understand the human question. 
     Do not include emojis in your answer`,
  ],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
]);

const chain = prompt.pipe(llm);

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: sessionId => history,
  inputMessagesKey: 'input',
  historyMessagesKey: 'chat_history',
});

console.log('Chat With AI');
console.log('Type /bye to stop the program');

let exit = false;
while (!exit) {
  const { question } = await prompts([
    {
      type: 'text',
      name: 'question',
      message: 'Your question: ',
      validate: value => (value ? true : 'Question cannot be empty'),
    },
  ]);
  if (question == '/bye') {
    console.log('See you later!');
    exit = true;
  } else {
    const response = await chainWithHistory.invoke(
      { input: question },
      {
        configurable: {
          sessionId: 'test',
        },
      }
    );
    console.log(response.content);
  }
}
