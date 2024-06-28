import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import prompts from 'prompts';
import 'dotenv/config';

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  openAIApiKey: process.env.OPENAI_KEY,
});

const prompt = new PromptTemplate({
  inputVariables: ['country', 'paragraph', 'language'],
  template: `
    You are a currency expert. 
    You give information about a specific currency used in a specific country. 
    Avoid giving information about fictional places. 
    If the country is fictional or non-existent, answer: I don't know.

    Answer the question: What is the currency of {country}?

    Answer in {paragraph} short paragraph in {language}
  `,
});

const chain = prompt.pipe(llm);

console.log('Currency Info');

const questions = [
  {
    type: 'text',
    name: 'country',
    message: 'What country?',
    validate: value => value ? true : 'Country cannot be empty',
  },
  {
    type: 'number',
    name: 'paragraph',
    message: 'How many paragraphs (1 to 5)?',
    validate: value =>
      value >= 1 && value <= 5 ? true : 'Paragraphs must be between 1 and 5',
  },
  {
    type: 'text',
    name: 'language',
    message: 'What Language?',
    validate: value => value ? true : 'Language cannot be empty',
  },
];

const { country, paragraph, language } = await prompts(questions);

const response = await chain.invoke({ country, paragraph, language });

console.log(response.content);
