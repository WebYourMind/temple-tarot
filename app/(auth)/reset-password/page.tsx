import { Metadata } from "next";
import ResetPasswordForm from "./components/reset-password-form";
import AuthPage from "../components/auth-page";

export const metadata: Metadata = {
  title: "Reset password - Merlin AI",
  description: "Merlin AI reset password page.",
};

export default function ForgotPassword() {
  return (
    <AuthPage heading="Reset Password" paragraph="Enter a new password below." formComponent={<ResetPasswordForm />} />
  );
}
