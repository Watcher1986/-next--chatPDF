import { OpenAIApi, Configuration } from 'openai-edge';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      input: text.replace(/\n/g, ' '),
      model: 'text-embedding-ada-002',
    });
    const result = await response.json();
    console.log('embeddings result', result, text);

    return result.data[0].embedding as number[];
  } catch (error) {
    console.log('error calling openai embeddings api', error);
    throw error;
  }
}
