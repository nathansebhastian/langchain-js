import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import prompts from 'prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

import 'dotenv/config';

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  apiKey: process.env.OPENAI_KEY,
  verbose: true,
});

const titlePrompt = new PromptTemplate({
  inputVariables: ['topic'],
  template: `
  You are an expert journalist.

  You need to come up with an interesting title for the following topic: {topic}

  Answer exactly with one title
  `,
});

const essayPrompt = new PromptTemplate({
  inputVariables: ['title'],
  template: `
  You are an expert nonfiction writer.

    You need to write a short essay of 350 words for the following title:

    {title}

    Make sure that the essay is engaging and makes the reader feel excited.
  `,
});

const firstChain = titlePrompt.pipe(llm).pipe(new StringOutputParser());

const secondChain = essayPrompt.pipe(llm);

const overallChain = firstChain
  .pipe(result => ({ title: result }))
  .pipe(secondChain);

console.log('Essay Writer');

const { topic } = await prompts([
  {
    type: 'text',
    name: 'topic',
    message: 'What topic to write?',
    validate: value => (value ? true : 'Topic cannot be empty'),
  },
]);

const response = await overallChain.invoke({ topic });
console.log(response.content);
