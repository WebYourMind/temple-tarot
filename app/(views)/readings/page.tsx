import { Metadata } from "next";
import appConfig from "app.config";
import dynamic from "next/dynamic";
import Loading from "components/loading";
import { cn } from "lib/utils";

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
      <h1 className={cn("mb-8 font-sans text-4xl font-bold")}>My Readings</h1>
      <Readings />
    </div>
  );
}
