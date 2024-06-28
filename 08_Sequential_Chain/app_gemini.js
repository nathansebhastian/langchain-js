import { PromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import prompts from 'prompts';
import {
  StringOutputParser,
  StructuredOutputParser,
} from '@langchain/core/output_parsers';

import 'dotenv/config';

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-pro-latest',
  apiKey: process.env.GOOGLE_GEMINI_KEY,
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
  inputVariables: ['title', 'emotion', 'format_instructions'],
  template: `
  You are an expert nonfiction writer.

    You need to write a short essay of 350 words for the following title:

    {title}

    Make sure that the essay is engaging and makes the reader feel {emotion}.

    {format_instructions}
  `,
});

const firstChain = titlePrompt.pipe(llm).pipe(new StringOutputParser());

const structuredParser = StructuredOutputParser.fromNamesAndDescriptions({
  title: 'the essay title',
  emotion: 'the emotion conveyed by the essay',
  essay: 'the essay content',
});

const secondChain = essayPrompt.pipe(llm).pipe(structuredParser);

console.log('Essay Writer');

const questions = [
  {
    type: 'text',
    name: 'topic',
    message: 'What topic to write?',
    validate: value => (value ? true : 'Topic cannot be empty'),
  },
  {
    type: 'text',
    name: 'emotion',
    message: 'What emotion to convey?',
    validate: value => (value ? true : 'Emotion cannot be empty'),
  },
];

const { topic, emotion } = await prompts(questions);

const overallChain = firstChain
  .pipe(result => ({
    title: result,
    emotion,
    format_instructions: structuredParser.getFormatInstructions(),
  }))
  .pipe(secondChain);

const response = await overallChain.invoke({
  topic,
});
console.log(response);
