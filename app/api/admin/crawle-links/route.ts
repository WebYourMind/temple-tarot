import { NextRequest, NextResponse } from "next/server";
import { readWebBaseContent, storeDocuments } from "../../../../lib/pineconeLangchain/pinecone";

// export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { links } = (await request.json()) as any;

    if (!links || links.length < 1) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    for (const link of links) {
      const docs = await readWebBaseContent(link);

      const source = docs[0].metadata.source;
      const pageContent = docs[0].pageContent;
      pageContent.replace("\n", " ");

      await storeDocuments([pageContent], [source]);

      return NextResponse.json({ message: "Success" }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
}
