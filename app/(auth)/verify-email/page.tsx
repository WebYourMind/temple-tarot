import { Metadata } from "next";
import Verify from "./components/verify";
import AuthPage from "../components/auth-page";

export const metadata: Metadata = {
  title: "Email verification - Ibis AI",
  description: "Ibis AI email verification page.",
};

export default function VerifyEmailPage() {
  return <AuthPage heading="Email Verification" paragraph="" formComponent={<Verify />} />;
}
