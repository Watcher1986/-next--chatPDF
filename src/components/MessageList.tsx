import { Message } from 'ai/react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  messages: Message[];
  isLoading: boolean;
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <Loader2 className='w-6 h-6 animate-spin' />
      </div>
    );
  }
  if (!messages?.length) return null;

  return (
    <div className='flex flex-col gap-2 p-4 max-h-[700px] overflow-y-auto'>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn('flex', {
            'justify-end pl-10': message.role === 'user',
            'justify-start mr-10 bg-white': message.role === 'system',
          })}
        >
          <div
            className={cn(
              'rounded-lg px-3 text-sm py-2 shadow-md ring-1 ring-gray-900/10',
              { 'bg-blue-600 text-white': message.role === 'user' }
            )}
          >
            <p>{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
