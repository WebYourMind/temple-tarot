import { Metadata } from "next";
import Profile from "./components/profile";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `My Profile - ${appConfig.appName}`,
  description: `${appConfig.appName} user profile.`,
};

export default async function ReportPage() {
  return (
    <div className="md:pt-16">
      <Profile />
    </div>
  );
}
