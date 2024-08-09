import { Button } from "components/ui/button";
import TarotCard from "./tarot-card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "lib/utils";
import { InfoButton } from "components/info-dialog";
import { MagicFont } from "../query/query-input";

function OrientationPicker({ finalCard, onSubmit, switchOrientation }) {
  return (
    <div className="flex h-full flex-col items-center justify-center pb-4 fade-in">
      <div className="flex">
        <InfoButton type="orientation" className="opacity-0" />
        <p className={cn("text-center font-sans text-xl", MagicFont.className)}>
          Is your card this way... <br />
          or that way?
        </p>
        <InfoButton type="orientation" />
      </div>
      <div className="flex items-center px-4">
        <button onClick={switchOrientation}>
          <ArrowUp className="pulse-1 opacity-90" size={25} />
        </button>
        <button onClick={() => onSubmit(finalCard)} className="mt-4 p-4 px-8">
          <div className="relative">
            <TarotCard
              alt="Your Card"
              className={`${
                finalCard.orientation === "upright" ? "rotate-0" : "rotate-180"
              } transition-transform duration-700`}
            />
          </div>
        </button>
        <button onClick={switchOrientation}>
          <ArrowDown className="pulse-2 opacity-90" size={25} />
        </button>
      </div>
      <div className="mt-4 flex w-full justify-around">
        <Button variant="default" className="w-1/3" onClick={switchOrientation}>
          Switch
        </Button>
        <Button variant="outline" className="w-1/3" onClick={() => onSubmit(finalCard)}>
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default OrientationPicker;
