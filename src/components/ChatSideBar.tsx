'use client';
import Link from 'next/link';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { DrizzleChat } from '@/lib/db/schema';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import SubscriptionBtn from './SubscriptionBtn';

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  return (
    <div className='relative w-full h-screen p-4 text-gray-200 bg-gray-900'>
      <Link href='/'>
        <Button className='w-full border-dashed border-white border'>
          <PlusCircle className='mr-2 w-4 h-4' />
          New Chat
        </Button>
      </Link>

      <div className='flex flex-col gap-2 mt-4'>
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn('rounded-lg p-3 text-slate-300 flex items-center', {
                'bg-blue-600 text-white': chat.id === chatId,
                'hover:text-white': chat.id !== chatId,
              })}
            >
              <MessageCircle className='mr-2' />
              <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className='absolute bottom-4 left-1/2 -translate-x-1/2'>
        <div className='flex items-center gap-2 text-sm text-slate-500 flex-wrap'>
          <Link href='/'>Home</Link>
          <Link href='/'>Source</Link>
        </div>

        <div className='flex items-center justify-center mt-3 text-slate-800'>
          <SubscriptionBtn isPro={isPro} size='lg' />
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;
