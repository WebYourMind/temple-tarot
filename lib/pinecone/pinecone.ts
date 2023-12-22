import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { VectorDBQAChain } from "langchain/chains";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

const pinecone = new Pinecone();

const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX);

const embeddings = new OpenAIEmbeddings();

export const storeDocument = async (document: string, source: string) => {
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

  const splitDocs = await splitter.createDocuments([document], [{ source }]);

  return await PineconeStore.fromDocuments(splitDocs, embeddings, { pineconeIndex, maxConcurrency: 10 });
};

export const queryDocument = async (query: string) => {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });

  const results = await vectorStore.similaritySearch(query, 3);

  return results;
};

export const queryDocumentChain = async (query: string) => {
  const model = new OpenAI();
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });

  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });
  const response = await chain.call({ query: query });

  return response;
};

export const readFolderFiles = async (folderPath: string) => {
  // "use server";
  const loader = new DirectoryLoader(folderPath, {
    ".txt": (path) => new TextLoader(path),
  });
  const docs = await loader.load();
  return docs;
};
