'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MessageCircle, PlusCircle, Trash2 } from 'lucide-react';

import { DrizzleChat } from '@/lib/db/schema';
import { Button } from './ui/button';
import { cn, getChatIndex } from '@/lib/utils';

import SubscriptionBtn from './SubscriptionBtn';
import Modal from './Modal';
import toast from 'react-hot-toast';

type Props = {
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chatId, isPro }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(0);
  const query = useQuery({
    queryKey: ['chat'],
    queryFn: async () => {
      const response = await axios.post<DrizzleChat[]>('/api/get-chats');
      return response.data;
    },
  });

  const chatIdx = getChatIndex(chatId, query.data!);

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
        const removedChatIdx = getChatIndex(chatToDelete, query.data!);
        if (removedChatIdx === chatIdx) {
          const goToChatId =
            chatIdx === 0
              ? query?.data?.[1].id
              : query?.data?.[chatIdx! - 1].id;
          router.push(`/chat/${goToChatId}`);
          return;
        }
        queryClient.invalidateQueries({ queryKey: ['chat'] });
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
          {query?.data?.map((chat) => (
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

        {isLoading && query.isLoading && <p>Loading...</p>}

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
