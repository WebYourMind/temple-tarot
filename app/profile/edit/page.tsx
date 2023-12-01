import { Metadata } from "next";
import EditProfile from "./components/edit-profile";

export const metadata: Metadata = {
  title: " AI",
  description: "A guide for thinking based on natural systems.",
};

export default async function ReportPage() {
  return (
    <div className="md:py-8">
      <EditProfile />
    </div>
  );
}
