import { Metadata } from "next";
import AuthPage from "app/(core)/(auth)/components/auth-page";
import LoginForm from "app/(core)/(auth)/login/components/login-form";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `Login - ${appConfig.appName}`,
  description: `${appConfig.appName} login page.`,
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
