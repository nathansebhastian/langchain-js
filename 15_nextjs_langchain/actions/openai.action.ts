'use server';

import { ChatOpenAI } from '@langchain/openai';
import { ChatMessageHistory } from 'langchain/memory';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';

  const llm = new ChatOpenAI({
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_KEY,
  });

  const history = new ChatMessageHistory();

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      'You are an AI chatbot having a conversation with a human. Use the following context to understand the human question. Do not include emojis in your answer',
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


export const getReply = async (message: string) => {
  const response = await chainWithHistory.invoke({
    input: message
  }, {
    configurable: {
      sessionId: "test"
    }
  });

  return response.content;
};
