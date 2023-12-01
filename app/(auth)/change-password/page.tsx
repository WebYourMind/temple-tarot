import { Metadata } from "next";
import ResetPasswordForm from "./components/change-password-form";
import AuthPage from "../components/auth-page";

export const metadata: Metadata = {
  title: "Change password - Ibis AI",
  description: "Ibis AI change password page.",
};

export default function ChangePassword() {
  return (
    <AuthPage
      heading="Change Password"
      paragraph="Confirm your old password and enter a new one below."
      formComponent={<ResetPasswordForm />}
    />
  );
}
