import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { marked } from 'marked';
import { Message } from './';

interface ChatListProps {
  apiKey: string;
  messages: Message[];
  loadingSubmit: boolean;
}

export default function ChatList({
  apiKey,
  messages,
  loadingSubmit,
}: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!apiKey) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <div className='flex flex-col gap-4 items-center'>
          <div
            className='bg-blue-50 text-blue-700 px-4 py-3 rounded'
            role='alert'
          >
            <p className='font-bold'>OpenAI Key</p>
            <p className='text-sm'>
              Input your OpenAI API Key to use this application.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <div className='flex flex-col gap-4 items-center'>
          <Image
            src='/robot.png'
            alt='AI'
            width={64}
            height={64}
            className='object-contain'
          />
          <p className='text-center text-lg text-muted-foreground'>
            How can I help you today?
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full overflow-x-hidden h-full justify-end'>
      <div className='w-full flex flex-col overflow-x-hidden overflow-y-hidden min-h-full justify-end'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2 p-4 ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className='flex gap-3 items-center'>
              {message.role === 'user' && (
                <div className='flex items-end gap-3'>
                  <span
                    className='bg-blue-100 p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto'
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(message.content),
                    }}
                  />
                  <span className='relative h-10 w-10 shrink-0 rounded-full flex justify-start items-center overflow-hidden'>
                    <Image
                      className='aspect-square h-full w-full object-contain'
                      alt='user'
                      width='32'
                      height='32'
                      src='/user.png'
                    />
                  </span>
                </div>
              )}
              {message.role === 'assistant' && (
                <div className='flex items-end gap-3'>
                  <span className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full flex justify-start items-center'>
                    <Image
                      className='aspect-square h-full w-full object-contain'
                      alt='AI'
                      width='32'
                      height='32'
                      src='/robot.png'
                    />
                  </span>
                  <span className='bg-blue-100 p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto'>
                    <span
                      key={index}
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(message.content),
                      }}
                    />
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loadingSubmit && (
          <div className='flex pl-4 pb-4 gap-2 items-center'>
            <span className='relative h-10 w-10 shrink-0 overflow-hidden rounded-full flex justify-start items-center'>
              <Image
                className='aspect-square h-full w-full object-contain'
                alt='AI'
                width='32'
                height='32'
                src='/robot.png'
              />
            </span>
            <div className='bg-blue-100 p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto'>
              <div className='flex gap-1'>
                <span className='size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite]'></span>
                <span className='size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_0.5s_ease-in-out_infinite]'></span>
                <span className='size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite]'></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div id='anchor' ref={bottomRef}></div>
    </div>
  );
}
