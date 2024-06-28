'use server';

import { ChatOpenAI } from '@langchain/openai';
import { ChatMessageHistory } from 'langchain/memory';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { createStreamableValue } from 'ai/rsc';
import { AIMessageChunk } from '@langchain/core/messages';

let chainWithHistory: RunnableWithMessageHistory<any, AIMessageChunk> | null =
  null;

export const setApi = async (apiKey: string) => {
  const llm = new ChatOpenAI({
    model: 'gpt-4o',
    apiKey: apiKey,
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

  chainWithHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: sessionId => history,
    inputMessagesKey: 'input',
    historyMessagesKey: 'chat_history',
  });
};

export const getReply = async (message: string) => {
  const stream = createStreamableValue();

  (async () => {
    const response = await (
      chainWithHistory as RunnableWithMessageHistory<any, AIMessageChunk>
    ).stream(
      {
        input: message,
      },
      {
        configurable: {
          sessionId: 'test',
        },
      }
    );

    for await (const chunk of response) {
      stream.update(chunk.content);
    }

    stream.done();
  })();

  return { streamData: stream.value };
};
