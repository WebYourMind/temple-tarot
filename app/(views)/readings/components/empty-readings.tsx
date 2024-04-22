import { EyeClosedIcon } from "@radix-ui/react-icons";
import Link from "next/link";

function EmptyReadings() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2>Nothing to see here.</h2>
      <EyeClosedIcon className="my-8 h-32 w-32 text-6xl" />
      <p>
        <Link href="/">Follow this link</Link> to take your first tarot reading.
      </p>
    </div>
  );
}

export default EmptyReadings;
