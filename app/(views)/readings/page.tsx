import { Metadata } from "next";
import appConfig from "app.config";
import dynamic from "next/dynamic";
import Loading from "components/loading";
// import { TarotSession } from "./components/tarot-session";
import { Baskervville } from "next/font/google";
import { cn } from "lib/utils";

export const tarotFont = Baskervville({ weight: ["400"], subsets: ["latin"] });

const Readings = dynamic(() => import("./components/readings"), {
  loading: () => <Loading />,
  ssr: false,
});

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.description,
};

export default async function Page() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className={cn("mb-8 text-4xl font-bold", tarotFont.className)}>My Readings</h1>
      <Readings />
    </div>
  );
}
