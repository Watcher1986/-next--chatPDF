import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { chats, messages } from '@/lib/db/schema';
import { removeFromS3 } from '@/lib/s3-server';

export async function DELETE(req: Request, res: Response) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { chatId } = await req.json();

    await db.delete(messages).where(eq(messages.chatId, chatId));
    const chat = await db
      .delete(chats)
      .where(eq(chats.id, chatId))
      .returning({ fileKey: chats.fileKey });

    await removeFromS3(chat[0].fileKey);

    return NextResponse.json({
      message: 'successfuly deleted!',
    });
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
