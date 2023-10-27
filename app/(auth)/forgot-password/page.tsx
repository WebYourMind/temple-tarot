import { Metadata } from "next";
import ForgotPasswordForm from "./components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password - Merlin AI",
  description: "Merlin AI forgot password page.",
};

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}
