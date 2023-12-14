import { Metadata } from "next";
import Team from "./components/team";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `Team - ${appConfig.appName}`,
  description: `${appConfig.appName} team dashboard.`,
};

export default async function TeamPage() {
  return <Team />;
}
