import { NextRequest } from "next/server";
import { readFolderFiles, storeDocument } from "../../../lib/pinecone/pinecone";

// export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    console.log("pinecone route");
    // const docs = await readFileSync("/mock-data/Design How Your Team Thinks.txt", "utf8");
    const docs = await readFolderFiles("mock-data\\shift-to");
    const store = await storeDocument(docs[0].pageContent, docs[0].metadata.source);

    console.log(docs);

    return new Response(docs, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
}
