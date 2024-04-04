import { Metadata } from "next";
import StripePricingTable from "./components/stripe-pricing-table";
import appConfig from "app.config";
import { getSession } from "next-auth/react";
import { User } from "next-auth";

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.description,
};

export default async function Home() {
  const session = await getSession();
  const user = session?.user as User;
  console.log(session);
  return (
    <div className="min-h-screen pt-8 md:pt-16">
      <StripePricingTable user={user} />
    </div>
  );
}
