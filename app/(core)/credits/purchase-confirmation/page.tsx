import { Metadata } from "next";
import appConfig from "app.config";
import PurchaseMessage from "./components/purchase-message";

export const metadata: Metadata = {
  title: `Thank you - ${appConfig.appName}`,
  description: appConfig.description,
};

export default async function PurchaseConfirmation() {
  return (
    <div className="min-h-screen pt-8 md:pt-16">
      <PurchaseMessage />
    </div>
  );
}
