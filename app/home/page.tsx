import { Metadata } from "next";
import { type Message } from "ai/react";
import { sql } from "@vercel/postgres";
import { Chat } from "components/chat/chat";
import { getSession } from "lib/auth";

export const metadata: Metadata = {
  title: "Merlin AI",
  description: "A guide for thinking based on natural systems.",
};

async function getExistingMessages(userId: string) {
  try {
    // Attempt to retrieve an existing chat thread for the user.
    const { rows: existingMessages } = await sql`SELECT * FROM chat_messages WHERE user_id=${userId};`;

    if (existingMessages.length > 0) {
      return existingMessages; // Return existing thread if found.
    }
  } catch (error) {
    console.error("An error occurred while getting existing messages:", error);
    throw error; // Re-throw the error to handle it in a calling function.
  }
}

export default async function Home() {
  const data = await getSession();
  let messages;
  if (data && data.user) {
    try {
      messages = (await getExistingMessages(data.user.id)) as Message[];
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="md:pt-16">
      <Chat initialMessages={messages} />
    </div>
  );
}
