'use client';

import { useState } from 'react';

interface ChatSidebarProps {
  handleSubmitKey: (apiKey: string) => void;
}

export default function ChatSidebar({ handleSubmitKey }: ChatSidebarProps) {
  const [keyInput, setKeyInput] = useState('');

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitKey(keyInput);
  };
  return (
    <aside className='fixed top-0 left-0 z-40 w-64 h-screen -translate-x-full translate-x-0'>
      <div className='h-full px-3 py-4 overflow-y-auto bg-slate-50'>
        <h1 className='mb-4 text-2xl font-extrabold'>OpenAI API Key</h1>
        <div className='w-full flex py-6 items-center justify-between lg:justify-center'>
          <form className='space-y-4' onSubmit={submitForm}>
            <input
              type='password'
              placeholder='API Key'
              className='border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
            />
            <button
              type='submit'
              className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
