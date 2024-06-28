import { pull } from 'langchain/hub';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AgentExecutor, createReactAgent } from 'langchain/agents';
import { DuckDuckGoSearch } from '@langchain/community/tools/duckduckgo_search';
import { WikipediaQueryRun } from '@langchain/community/tools/wikipedia_query_run';
import { Calculator } from '@langchain/community/tools/calculator';

import 'dotenv/config';
import prompts from 'prompts';

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-pro-latest',
  apiKey: process.env.GOOGLE_GEMINI_KEY,
  verbose: true,
  stopSequences: ['\nObservation'],
});

const wikipedia = new WikipediaQueryRun({
  topKResults: 3,
  maxDocContentLength: 4000,
});

const ddgSearch = new DuckDuckGoSearch({ maxResults: 3 });

const calculator = new Calculator();

const tools = [wikipedia, ddgSearch, calculator];

export const askAgent = async question => {
  const prompt = await pull('hwchase17/react');

  const agent = await createReactAgent({ llm, tools, prompt });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  await agentExecutor.invoke({ input: question });
};

const { question } = await prompts([
  {
    type: 'text',
    name: 'question',
    message: 'Your question: ',
    validate: value => (value ? true : 'Question cannot be empty'),
  },
]);
askAgent(question);
