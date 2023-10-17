import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from '@pinecone-database/pinecone';
import {
  Document,
  RecursiveCharacterTextSplitter,
} from '@pinecone-database/doc-splitter';
import md5 from 'md5';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { downloadFromS3 } from './s3-server';
import { getEmbeddings } from './embeddings';
// import { convertToAscii } from './utils';

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. obtain the pdf -> download and read from pdf
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error('could not download file from s3');
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // 2. split and segment the pdf into
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorize and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 4. upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = client.index('chat-pdf-service');

  // const namespace = convertToAscii(fileKey)
  // const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
  // @ts-ignore
  if (vectors?.length) await pineconeIndex.upsert(vectors);

  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord<RecordMetadata>;
  } catch (error) {
    console.log('error embedding document', error);
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const encoder = new TextEncoder();
  return new TextDecoder('utf-8').decode(encoder.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\s+/g, ' ');
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
