import { Metadata } from "next";
import appConfig from "app.config";
import Markdown from "react-markdown";
import privacyPolicy from "./privacy-policy";

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.description,
};

export default async function Interpretation() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-32">
      <Markdown>{privacyPolicy}</Markdown>
    </div>
  );
}
