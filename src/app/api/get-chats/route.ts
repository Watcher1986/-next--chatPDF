import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const _chats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId));

    return NextResponse.json(_chats);
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
};
