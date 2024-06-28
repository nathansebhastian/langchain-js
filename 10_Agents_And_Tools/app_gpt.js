import { pull } from 'langchain/hub';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createReactAgent } from 'langchain/agents';
import { DuckDuckGoSearch } from '@langchain/community/tools/duckduckgo_search';
import { WikipediaQueryRun } from '@langchain/community/tools/wikipedia_query_run';
import { Calculator } from '@langchain/community/tools/calculator';

import 'dotenv/config';
import prompts from 'prompts';

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  apiKey: process.env.OPENAI_KEY,
});

const prompt = await pull('hwchase17/react');

const wikipedia = new WikipediaQueryRun();

const ddgSearch = new DuckDuckGoSearch({ maxResults: 3 });

const calculator = new Calculator();

const tools = [wikipedia, ddgSearch, calculator];

const agent = await createReactAgent({ llm, tools, prompt });

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true
});

const { question } = await prompts([
  {
    type: 'text',
    name: 'question',
    message: 'Your question: ',
    validate: value => (value ? true : 'Question cannot be empty'),
  },
]);

const response = await agentExecutor.invoke({ input: question });
console.log(response);
