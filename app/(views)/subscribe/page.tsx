import { Metadata } from "next";
import appConfig from "app.config";
import CustomPricingTable from "./components/custom-pricing-table";

export const metadata: Metadata = {
  title: `Get Lumens - ${appConfig.appName}`,
  description: appConfig.description,
};

export default async function GetCredits() {
  return (
    <div className="min-h-screen pt-8 md:pt-16">
      <CustomPricingTable />
    </div>
  );
}
