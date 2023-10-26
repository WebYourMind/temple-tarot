import { Metadata } from "next";
import AuthenticationPage from "app/(auth)/components/auth-page";
import LoginForm from "app/(auth)/login/components/login-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function LoginPage() {
  return (
    <AuthenticationPage
      heading="Welcome back"
      paragraph="Enter your login details below to sign in to your account"
      formComponent={<LoginForm />}
      link="/register"
      linkText="Register"
    />
  );
}
