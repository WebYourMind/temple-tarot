import { Metadata } from "next";
import appConfig from "app.config";
import dynamic from "next/dynamic";
import Loading from "components/loading";

const Reading = dynamic(() => import("./reading"), {
  loading: () => <Loading />,
  ssr: false,
});

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.description,
};

export default async function Page({ params }: { params: { id: string } }) {
  return <Reading readingId={params.id} />;
}
