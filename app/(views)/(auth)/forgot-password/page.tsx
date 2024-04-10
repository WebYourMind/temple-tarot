import { Metadata } from "next";
import ForgotPasswordForm from "./components/forgot-password-form";
import AuthPage from "../components/auth-page";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `Forgot password - ${appConfig.appName}`,
  description: `${appConfig.appName} forgot password page.`,
};

export default function ForgotPassword() {
  return (
    <AuthPage
      heading="Forgot your password?"
      paragraph="Enter your email address below and we'll send you a link to reset it."
      formComponent={<ForgotPasswordForm />}
    />
  );
}
