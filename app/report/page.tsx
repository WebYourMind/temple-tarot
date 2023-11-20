import { Metadata } from "next";
import Report from "./components/report";

export const metadata: Metadata = {
  title: "Merlin AI",
  description: "A guide for thinking based on natural systems.",
};

export default async function ReportPage() {
  return (
    <div className="md:pt-16">
      <Report />
    </div>
  );
}
