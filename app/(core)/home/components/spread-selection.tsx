import { Button } from "components/ui/button";
import Image from "next/image";
import ThothCard from "../../../thoth-card.png";

const SpreadSelection = ({ onSpreadSelect }: { onSpreadSelect: (spread: string) => void }) => {
  const handleChange = (value: string) => {
    onSpreadSelect(value);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-lg font-semibold">Select Your Tarot Spread</h2>
      <Button
        onClick={() => handleChange("single")}
        className="flex h-full flex-col space-y-2 pt-4 transition hover:scale-105"
      >
        <Image src={ThothCard} alt="Your card" width={200} height={350} />
        <span>Single Card</span>
      </Button>
    </div>
  );
};

export default SpreadSelection;
