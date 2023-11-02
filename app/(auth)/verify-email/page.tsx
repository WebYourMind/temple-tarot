import { Metadata } from "next";
import Verify from "./components/verify";

export const metadata: Metadata = {
  title: "Email verification - Merlin AI",
  description: "Merlin AI email verification page.",
};

export default function VerifyEmailPage() {
  return <Verify />;
}
