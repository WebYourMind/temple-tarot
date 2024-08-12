import { Metadata } from "next";
import appConfig from "app.config";
import dynamic from "next/dynamic";
import Loading from "components/loading";

const Interpreter = dynamic(() => import("../../../components/tarot-session/interpreter"), {
  loading: () => <Loading />,
  ssr: false,
});

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.description,
};

export default async function Interpretation() {
  return <Interpreter />;
}
