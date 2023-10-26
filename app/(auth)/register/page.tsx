import { Metadata } from "next";
import AuthenticationPage from "app/(auth)/components/auth-page";
import RegisterForm from "app/(auth)/register/components/register-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function RegistrationPage() {
  return (
    <AuthenticationPage
      heading="Create an account"
      paragraph="Enter your details below to create your account"
      formComponent={<RegisterForm />}
      link="/login"
      linkText="Login"
    />
  );
}
