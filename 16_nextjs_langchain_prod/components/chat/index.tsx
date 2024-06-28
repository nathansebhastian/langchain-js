'use client';

import { useState } from 'react';
import ChatList from './chat-list';
import ChatBottombar from './chat-bottombar';
import { setApi, getReply } from '@/actions/openai.action';
import { readStreamableValue } from 'ai/rsc';
import ChatSidebar from './chat-sidebar';

export interface Message {
  role: string;
  content: string;
}

export default function Chat() {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiKey, setApiKey] = useState('');

  const sendMessage = async (newMessage: Message) => {
    setLoadingSubmit(true);
    setMessages(prevMessages => [...prevMessages, newMessage]);

    const { streamData } = await getReply(newMessage.content);

    const reply: Message = {
      role: 'assistant',
      content: '',
    };

    
    setLoadingSubmit(false);
    setMessages(prevMessages => [...prevMessages, reply]);
    for await (const stream of readStreamableValue(streamData)) {
      reply.content = `${reply.content}${stream}`;
      setMessages(prevMessages => {
        return [...prevMessages.slice(0, -1), reply];
      });
    }
  };

  const handleSubmitKey = async (apiKey: string) => {
    await setApi(apiKey);
    setApiKey(apiKey);
  };

  return (
    <div className='max-w-2xl flex flex-col justify-between w-full h-full  '>
      <ChatSidebar handleSubmitKey={handleSubmitKey} />
      <ChatList
        apiKey={apiKey}
        messages={messages}
        loadingSubmit={loadingSubmit}
      />
      {apiKey && <ChatBottombar sendMessage={sendMessage} />}
    </div>
  );
}
