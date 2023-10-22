import { OpenAIApi, Configuration } from 'openai-edge';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const input = text?.replace(/\n/g, ' ');
    console.log('TEXT =>>>>>>', input);
    const response = await openai.createEmbedding({
      input,
      model: 'text-embedding-ada-002',
    });
    const result = await response.json();

    console.log(
      'embeddings =>>>>',
      result.data[0].embedding,
      'RESULT =>>>>>>>>>>>',
      result,
      'TEXT =>>>>>>>>>>>',
      text,
      text.replace(/\n/g, ' ')
    );

    return result.data[0].embedding as number[];
  } catch (error) {
    console.error('error calling openai embeddings api', error);
    throw error;
  }
}
