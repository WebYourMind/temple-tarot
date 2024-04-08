import { Metadata } from "next";
import ResetPasswordForm from "./components/reset-password-form";
import AuthPage from "../components/auth-page";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `Reset password - ${appConfig.appName}`,
  description: `${appConfig.appName} reset password page.`,
};

export default function ForgotPassword() {
  return (
    <AuthPage heading="Reset Password" paragraph="Enter a new password below." formComponent={<ResetPasswordForm />} />
  );
}
