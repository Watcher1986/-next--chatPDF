import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { checkSubscription } from '@/lib/subscription';

import PDFViewer from '@/components/PDFViewer';
import ChatComponent from '@/components/ChatComponent';
import ChatSideBar from '@/components/ChatSideBar';

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = auth();
  const isPro = await checkSubscription({ userId });

  if (!userId) {
    return redirect('/sign-in');
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats?.find((chat) => chat.id === parseInt(chatId))) {
    return redirect('/');
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className='flex max-h-screen'>
      <div className='flex w-full max-h-screen overflow-y-scroll'>
        {/* chat sidebar */}
        <div className='flex-[1.5] max-w-xs'>
          <ChatSideBar chatId={+chatId} isPro={isPro} />
        </div>
        {/* pdf viewer */}
        <div className='max-h-screen flex-[5]'>
          {currentChat?.pdfUrl && (
            <PDFViewer pdf_url={currentChat?.pdfUrl ?? ''} />
          )}
        </div>
        {/* chat component */}
        <div className='flex-[2.5] border-1-4 border-1-slate-200 bg-slate-100'>
          <ChatComponent chatId={+chatId} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
