import { Metadata } from "next";
import { type Message } from "ai/react";
import { sql } from "@vercel/postgres";
import { Chat } from "components/chat/chat";
import { getSession } from "lib/auth";

export const metadata: Metadata = {
  title: "Merlin AI",
  description: "A guide for thinking based on natural systems.",
};

export default async function Home() {
  return (
    <div className="md:pt-16">
      <Chat />
    </div>
  );
}
