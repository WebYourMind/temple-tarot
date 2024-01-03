import { Metadata } from "next";
import Profile from "./components/profile";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `My Profile - ${appConfig.appName}`,
  description: `${appConfig.appName} user profile.`,
};

export default async function ProfilePage() {
  return (
    <div className="pt-8 md:pt-16">
      <Profile />
    </div>
  );
}
