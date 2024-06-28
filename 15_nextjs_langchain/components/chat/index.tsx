'use client';

import { useState } from 'react';
import ChatList from './chat-list';
import ChatBottombar from './chat-bottombar';
import { getReply } from '@/actions/openai.action';

export interface Message {
  role: string;
  content: string;
}

export default function Chat() {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (newMessage: Message) => {
    setLoadingSubmit(true);
    setMessages(prevMessages => [...prevMessages, newMessage]);

    const response = await getReply(newMessage.content);

    const reply: Message = {
      role: 'assistant',
      content: response as string,
    };
    setLoadingSubmit(false);
    setMessages(prevMessages => [...prevMessages, reply]);
  };

  return (
    <div className='max-w-2xl flex flex-col justify-between w-full h-full  '>
      <ChatList messages={messages} loadingSubmit={loadingSubmit} />
      <ChatBottombar sendMessage={sendMessage} />
    </div>
  );
}
