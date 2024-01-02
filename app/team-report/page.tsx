import { Metadata } from "next";
import TeamReport from "./components/team-report";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `Team Insights - ${appConfig.appName}`,
  description: `${appConfig.appName} team insights page.`,
};

export default async function TeamReportPage() {
  return (
    <div className="pt-8 md:pt-16">
      <TeamReport />
    </div>
  );
}
