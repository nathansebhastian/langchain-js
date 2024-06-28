import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Message } from './';

interface ChatBottombarProps {
  sendMessage: (newMessage: Message) => void;
}

export default function ChatBottombar({ sendMessage }: ChatBottombarProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage({ role: 'user', content: input });
      setInput('');
    }
  };

  return (
    <div className='p-4 flex justify-between w-full items-center gap-2'>
      <form className='w-full items-center flex relative gap-2'>
        <TextareaAutosize
          autoComplete='off'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type your message...'
          className='border-input max-h-20 px-5 py-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full border rounded-full flex items-center h-14 resize-none overflow-hidden'
        />
        <button
          className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-14 w-14'
          type='submit'
        >
          <PaperPlaneIcon />
        </button>
      </form>
    </div>
  );
}
