import { Metadata } from "next";
import { Chat } from "components/chat/chat";

export const metadata: Metadata = {
  title: "Merlin AI",
  description: "A guide for thinking based on natural systems.",
};

export default async function WelcomePage() {
  return (
    <div className="md:pt-16">
      <Chat />
    </div>
  );
}
