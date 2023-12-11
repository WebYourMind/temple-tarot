import { Metadata } from "next";
import Verify from "./components/verify";
import AuthPage from "../components/auth-page";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `Email verification - ${appConfig.appName}`,
  description: `${appConfig.appName} email verification page.`,
};

export default function VerifyEmailPage() {
  return <AuthPage heading="Email Verification" paragraph="" formComponent={<Verify />} />;
}
