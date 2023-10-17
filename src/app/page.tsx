import Link from 'next/link';
import { UserButton, auth } from '@clerk/nextjs';
import { ArrowRight, LogIn } from 'lucide-react';
import { eq } from 'drizzle-orm';
import { checkSubscription } from '@/lib/subscription';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';

import { Button } from '@/components/ui/button';
import SubscriptionBtn from '@/components/SubscriptionBtn';
import FileUpload from '@/components/FileUpload';

export default async function Home() {
  const { userId } = auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) firstChat = firstChat[0];
  }

  return (
    <div className='w-screen min-h-screen bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-sky-400 to-indigo-900'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col items-center text-center'>
          <div className='flex items-center'>
            <h1 className='mr-3 text-5xl font-semibold'>Chat with any PDF</h1>
            <UserButton afterSignOutUrl='/' />
          </div>

          <div className='flex mt-3'>
            {isAuth && firstChat && (
              <Link href={`/chat/${firstChat.id}`}>
                <Button>
                  Go to chats
                  <ArrowRight className='ml-2' />
                </Button>
              </Link>
            )}
            <div className='ml-3'>
              <SubscriptionBtn isPro={isPro} size='default' />
            </div>
          </div>

          <p className='max-w-xl mt-2 text-lg text-slate-700'>
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research with AI
          </p>

          <div className='w-full mt-4'>
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href='/sign-in'>
                <Button>
                  Login to get started
                  <LogIn className='w-5 h-5 ml-2' />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
