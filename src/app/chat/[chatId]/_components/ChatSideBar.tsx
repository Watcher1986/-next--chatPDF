'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { MessageCircle, PlusCircle, Trash2 } from 'lucide-react';
import { DrizzleChat } from '@/lib/db/schema';
import { Button } from '../../../../components/ui/button';
import { cn } from '@/lib/utils';

import SubscriptionBtn from '../../../../components/SubscriptionBtn';
import Modal from '../../../../components/Modal';
import toast from 'react-hot-toast';

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const [isModal, setIsModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(0);
  const { isLoading, mutate } = useMutation({
    mutationFn: async (chat_id: number) => {
      const response = await axios.delete('/api/remove-chat', {
        data: { chatId: chat_id },
      });
      return response.data;
    },
  });

  const onDeleteChat = (e: React.MouseEvent, chatId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModal((prev) => !prev);
    setChatToDelete(chatId);
  };

  const handleConfirmDeleteChat = () => {
    setIsModal(false);

    mutate(chatToDelete, {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (err) => {
        console.error(err);
        toast.error('Error deleting chat');
      },
    });
  };

  return (
    <>
      {isModal && (
        <Modal
          onCancel={() => setIsModal(false)}
          onConfirm={handleConfirmDeleteChat}
          title='Delete chat?'
          bodyText='Once you delete chat there is no way to restore it.'
        />
      )}
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
                className={cn(
                  'rounded-lg p-3 text-slate-300 flex items-center',
                  {
                    'bg-blue-600 text-white': chat.id === chatId,
                    'hover:text-white': chat.id !== chatId,
                  }
                )}
              >
                <MessageCircle className='mr-2' />
                <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>
                  {chat.pdfName}
                </p>
                <Trash2
                  className='ml-2 hover:text-slate-300'
                  onClick={(e) => onDeleteChat(e, chat.id)}
                />
              </div>
            </Link>
          ))}
        </div>

        {isLoading && <p>Loading...</p>}

        <div className='absolute bottom-4 left-1/2 -translate-x-1/2'>
          <div className='flex items-center justify-center text-sm text-slate-500 flex-wrap'>
            <div className='flex gap-2'>
              <Link href='/'>Home</Link>
              <Link href='/'>Source</Link>
            </div>
          </div>

          <div className='flex items-center justify-center mt-3 text-slate-800'>
            <SubscriptionBtn isPro={isPro} size='lg' />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSideBar;
