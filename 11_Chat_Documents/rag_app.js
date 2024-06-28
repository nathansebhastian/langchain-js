import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import prompts from 'prompts';

// New packages:
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';

import 'dotenv/config';

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  apiKey: process.env.OPENAI_KEY,
});

const loader = new TextLoader('./ai-discussion.txt');
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const chunks = await splitter.splitDocuments(docs);

const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_KEY });

const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);

const retriever = vectorStore.asRetriever();

const systemPrompt = `You are an assistant for question-answering tasks. 
  Use the following pieces of retrieved context to answer 
  the question. If you don't know the answer, say that you 
  don't know. Use three sentences maximum and keep the 
  answer concise.
  \n\n
  {context}`;

const prompt = ChatPromptTemplate.fromMessages([
  ['system', systemPrompt],
  ['human', '{input}'],
]);

const questionAnswerChain = await createStuffDocumentsChain({
  llm: llm,
  prompt: prompt,
});

const ragChain = await createRetrievalChain({
  retriever: retriever,
  combineDocsChain: questionAnswerChain,
});

const { question } = await prompts([
  {
    type: 'text',
    name: 'question',
    message: 'Your question: ',
    validate: value => (value ? true : 'Question cannot be empty'),
  },
]);

const response = await ragChain.invoke(
  { input: question },
  {
    configurable: {
      sessionId: 'test',
    },
  }
);
console.log(response.answer);