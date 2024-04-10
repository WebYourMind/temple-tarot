import { Metadata } from "next";
import appConfig from "app.config";
import { TarotSession } from "./components/tarot-session";

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.description,
};

export default async function Home() {
  return <TarotSession />;
}
