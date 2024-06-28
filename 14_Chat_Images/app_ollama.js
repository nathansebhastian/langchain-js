import { ChatOllama } from '@langchain/community/chat_models/ollama';

import { ChatMessageHistory } from 'langchain/memory';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';

import { readFile } from 'node:fs/promises';
import prompts from 'prompts';

import 'dotenv/config';

const llm = new ChatOllama({
  model: 'bakllava',
  verbose: false,
});

async function encodeImage(imagePath) {
  const imageData = await readFile(imagePath);
  return imageData.toString('base64');
}

const image = await encodeImage('./image.jpg');

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful assistant that can describe images in detail.'],
  new MessagesPlaceholder('chat_history'),
  [
    'human',
    [
      { type: 'text', text: '{input}' },
      {
        type: 'image_url',
        image_url: `data:image/jpeg;base64,${image}`,
      },
    ],
  ],
]);

const history = new ChatMessageHistory();

const chain = prompt.pipe(llm);

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: sessionId => history,
  inputMessagesKey: 'input',
  historyMessagesKey: 'chat_history',
});

console.log('Chat With Image');
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
