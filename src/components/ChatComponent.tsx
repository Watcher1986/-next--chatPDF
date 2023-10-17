'use client';
import { useEffect } from 'react';
import { useChat } from 'ai/react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Message } from 'ai';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import MessageList from './MessageList';

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>('/api/get-messages', {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: '/api/chat',
    body: {
      chatId,
    },
    initialMessages: data ?? [],
  });

  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;
    messagesContainer?.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className='relative max-h-screen' id='messages-container'>
      {/* header */}
      <div className='sticky top-0 inset-x-0 p-2 bg-transparent h-fit'>
        <h3 className='text-xl font-bold'>Chat</h3>
      </div>

      {/* message list */}
      <MessageList messages={messages} isLoading={isLoading} />

      <form
        onSubmit={handleSubmit}
        className='sticky bottom-0 inset-x-0 px-2 py-4 bg-transparent'
      >
        <div className='flex'>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder='Ask any question...'
            className='w-full'
          />
          <Button className='bg-blue-600 ml-2'>
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
