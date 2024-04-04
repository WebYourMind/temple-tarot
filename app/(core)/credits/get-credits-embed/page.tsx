import { Metadata } from "next";
import appConfig from "app.config";
import MyPricingTable from "./components/my-pricing-table";

export const metadata: Metadata = {
  title: `Get Credits - ${appConfig.appName}`,
  description: appConfig.description,
};

export default async function GetCreditsEmbed() {
  return (
    <div className="min-h-screen pt-8 md:pt-16">
      <MyPricingTable />
    </div>
  );
}
