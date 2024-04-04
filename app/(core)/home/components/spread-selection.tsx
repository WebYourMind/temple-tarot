import { Button } from "components/ui/button";

const SpreadSelection = ({ onSpreadSelect }: { onSpreadSelect: (spread: string) => void }) => {
  const handleChange = (value: string) => {
    onSpreadSelect(value);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-lg font-semibold">Select Your Tarot Spread</h2>
      <Button onClick={() => handleChange("single")}>Single Card</Button>
    </div>
  );
};

export default SpreadSelection;
