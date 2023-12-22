import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { VectorDBQAChain } from "langchain/chains";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

const pinecone = new Pinecone();

const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX);

const embeddings = new OpenAIEmbeddings();

export const readWebBaseContent = async (url: string) => {
  const loader = new CheerioWebBaseLoader(url);
  return await loader.load();
};

export const storeDocuments = async (documents: string[], sources: string[]) => {
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  const sourcesList = sources.map((source) => ({ source }));
  const splitDocs = await splitter.createDocuments(documents, sourcesList);

  return await PineconeStore.fromDocuments(splitDocs, embeddings, { pineconeIndex, maxConcurrency: 10 });
};

export const queryDocument = async (query: string) => {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });

  return await vectorStore.similaritySearch(query, 3);
};

export const queryDocumentChain = async (query: string) => {
  const model = new OpenAI();
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });

  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });
  return await chain.call({ query: query });
};

export const readFolderFiles = async (folderPath: string) => {
  // "use server";
  const loader = new DirectoryLoader(folderPath, {
    ".txt": (path) => new TextLoader(path),
  });
  return await loader.load();
};
