import { Metadata } from "next";
import AuthPage from "app/(core)/(auth)/components/auth-page";
import RegisterForm from "app/(core)/(auth)/register/components/register-form";
import appConfig from "app.config";

export const metadata: Metadata = {
  title: `Register - ${appConfig.appName}`,
  description: `${appConfig.appName} registration page.`,
};

export default function RegistrationPage() {
  return (
    <AuthPage
      heading="Create an account"
      paragraph="Enter your details below to create your account"
      formComponent={<RegisterForm />}
    />
  );
}
