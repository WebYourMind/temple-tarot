import { Metadata } from "next";
import { Chat } from "components/chat/chat";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.description,
};

export default async function Home() {
  return (
    <div className="md:pt-16">
      <Chat />
    </div>
  );
}
