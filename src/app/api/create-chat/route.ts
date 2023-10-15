// /api/create-chat
import { NextResponse } from 'next/server';
import { loadS3IntoPinecone } from '@/lib/pinecone';

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log(file_key, file_name, body);
    const pages = await loadS3IntoPinecone(file_key);
    return NextResponse.json({ pages });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
