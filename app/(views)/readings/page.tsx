import { Metadata } from "next";
import appConfig from "app.config";
import dynamic from "next/dynamic";
import Loading from "components/loading";
import { cn } from "lib/utils";

const ReadingsList = dynamic(() => import("./components/readings-list"), {
  // loading: () => <Loading />,
  ssr: false,
});

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.description,
};

export default async function Page() {
  return (
    <div className="container max-w-4xl px-4 py-2">
      <ReadingsList />
    </div>
  );
}
