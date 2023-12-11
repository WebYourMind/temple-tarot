import { Metadata } from "next";
import EditProfile from "./components/edit-profile";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `Edit Profile - ${appConfig.appName}`,
  description: `${appConfig.appName} edit profile page.`,
};

export default async function ReportPage() {
  return (
    <div className="md:py-8">
      <EditProfile />
    </div>
  );
}
