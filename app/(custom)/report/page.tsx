import { Metadata } from "next";
import Report from "./components/report";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `Insights - ${appConfig.appName}`,
  description: `${appConfig.appName} insight report page.`,
};

export default async function ReportPage() {
  return (
    <div className="pt-8 md:pt-16">
      <Report />
    </div>
  );
}
