import { ChatOpenAI } from '@langchain/openai';

import { ChatPromptTemplate } from '@langchain/core/prompts';

import { readFile } from 'node:fs/promises';

import 'dotenv/config';

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  apiKey: process.env.OPENAI_KEY,
});

const encodeImage = async imagePath => {
  const imageData = await readFile(imagePath);
  return imageData.toString('base64');
}

const image = await encodeImage('./image.jpg');

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful assistant that can describe images in detail.'],
  ['human',
    [
      { type: 'text', text: '{input}' },
      {
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${image}`,
          detail: 'low',
        },
      },
    ],
  ],
]);

const chain = prompt.pipe(llm);
const response = await chain.invoke({"input": "What do you see on this image?"})

console.log(response.content);
