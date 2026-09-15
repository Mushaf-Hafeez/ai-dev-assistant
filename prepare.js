import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const loader = new TextLoader("./docs/authentication.txt");

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 50,
  chunkOverlap: 10,
});

import "dotenv/config";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: "gemini-embedding-001",
});

const vectorStore = new MemoryVectorStore(embeddings);

export const createVectorIndex = async () => {
  try {
    // load document
    const docs = await loader.load();

    // get text
    const text = docs[0].pageContent;

    // split text into chunks
    const chunks = await splitter.splitText(text);

    // create documents
    const documents = chunks.map((chunk) => {
      return {
        pageContent: chunk,
        metadata: {},
      };
    });

    const vectors = await embeddings.embedDocuments(chunks);

    await vectorStore.addVectors(vectors, documents);

    return vectorStore;
  } catch (error) {
    console.log("Error in the main function: ", error);
  }
};
