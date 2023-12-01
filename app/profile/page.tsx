import { Metadata } from "next";
import Profile from "./components/profile";

export const metadata: Metadata = {
  title: "Ibis AI",
  description: "A guide for thinking based on natural systems.",
};

export default async function ReportPage() {
  return (
    <div className="md:pt-16">
      <Profile />
    </div>
  );
}
