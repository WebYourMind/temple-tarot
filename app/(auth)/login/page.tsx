import { Metadata } from "next";
import AuthPage from "app/(auth)/components/auth-page";
import LoginForm from "app/(auth)/login/components/login-form";

export const metadata: Metadata = {
  title: "Login - Merlin AI",
  description: "Merlin AI login page.",
};

export default function LoginPage() {
  return (
    <AuthPage
      heading="Welcome"
      paragraph="Enter your login details below to sign in to your account"
      formComponent={<LoginForm />}
    />
  );
}
