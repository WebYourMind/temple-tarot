import { Metadata } from "next";
import ResetPasswordForm from "./components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password - Merlin AI",
  description: "Merlin AI reset password page.",
};

export default function ForgotPassword() {
  return <ResetPasswordForm />;
}
