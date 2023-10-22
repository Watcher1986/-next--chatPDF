import { existsSync, unlinkSync } from 'fs';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { chats, messages } from '@/lib/db/schema';
import { initS3 } from '@/lib/s3';

export const runtime = 'edge';

export async function DELETE(req: Request, res: Response) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const s3 = initS3();
    const { chatId } = await req.json();

    await db.delete(messages).where(eq(messages.chatId, chatId));
    const chat = await db
      .delete(chats)
      .where(eq(chats.id, chatId))
      .returning({ fileKey: chats.fileKey });

    s3.deleteObject(
      {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: chat[0].fileKey,
      },
      (err, data) => {
        if (err) console.log('error deleting from s3', err);
        else console.log(data);
      }
    );

    if (existsSync(`./tmp/${chat[0].fileKey.split('uploads/')[1]}`))
      unlinkSync(`./tmp/${chat[0].fileKey.split('uploads/')[1]}`);

    return NextResponse.json({
      message: 'successfuly deleted!',
    });
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
