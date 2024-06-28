import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import prompts from 'prompts';

// Document Loaders
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from 'langchain/document_loaders/fs/text';

// Get File Extension
import path from 'path';

// Chat History
import { ChatMessageHistory } from 'langchain/memory';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';

import 'dotenv/config';

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-pro-latest',
  apiKey: process.env.GOOGLE_GEMINI_KEY,
  verbose: true,
});

const filePath = './python.pdf';

const extension = path.extname(filePath);

let loader = null;

if (extension === '.txt'){
  loader = new TextLoader(filePath);
} else if (extension === '.pdf') {
  loader = new PDFLoader(filePath);
} else if (extension === '.docx') {
  loader = new DocxLoader(filePath);
} else {
  throw new Error('The document format is not supported');
}

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const chunks = await splitter.splitDocuments(docs);

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_GEMINI_KEY,
  modelName: 'embedding-001',
});

const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);

const retriever = vectorStore.asRetriever();

const contextualizeSystemPrompt = `
Given a chat history and the latest user question 
which might reference context in the chat history, formulate a standalone question 
which can be understood without the chat history. Do NOT answer the question, 
just reformulate it if needed and otherwise return it as is.
`;

const contextualizePrompt = ChatPromptTemplate.fromMessages([
  ['system', contextualizeSystemPrompt],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
]);

const historyAwareRetriever = await createHistoryAwareRetriever({
  llm,
  retriever,
  rephrasePrompt: contextualizePrompt,
});

const systemPrompt = `You are an assistant for question-answering tasks. 
  Use the following pieces of retrieved context to answer 
  the question. If you don't know the answer, say that you 
  don't know. Use three sentences maximum and keep the 
  answer concise.
  \n\n
  {context}`;

const prompt = ChatPromptTemplate.fromMessages([
  ['system', systemPrompt],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
]);

const questionAnswerChain = await createStuffDocumentsChain({
  llm,
  prompt: prompt,
});

const ragChain = await createRetrievalChain({
  retriever: historyAwareRetriever,
  combineDocsChain: questionAnswerChain,
});

const history = new ChatMessageHistory();

const conversationalRagChain = new RunnableWithMessageHistory({
  runnable: ragChain,
  getMessageHistory: sessionId => history,
  inputMessagesKey: 'input',
  historyMessagesKey: 'chat_history',
  outputMessagesKey: 'answer',
});

let exit = false;
while (!exit) {
  const { question } = await prompts([
    {
      type: 'text',
      name: 'question',
      message: 'Your question: ',
      validate: value => (value ? true : 'Question cannot be empty'),
    },
  ]);
  if (question == '/bye') {
    console.log('See you later!');
    exit = true;
  } else {
    const response = await conversationalRagChain.invoke(
      { input: question },
      {
        configurable: {
          sessionId: 'test',
        },
      }
    );
    console.log(response.answer);
  }
}
