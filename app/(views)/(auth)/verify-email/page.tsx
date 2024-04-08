import { Metadata } from "next";
import Verify from "./components/verify";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `Email verification - ${appConfig.appName}`,
  description: `${appConfig.appName} email verification page.`,
};

export default function VerifyEmailPage() {
  return <Verify />;
}
