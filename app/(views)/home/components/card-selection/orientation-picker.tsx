import { Button } from "components/ui/button";
import Card from "../tarot-card";
import { IconRotate } from "components/ui/icons";
import { ArrowBigDown, ArrowBigUp, ArrowDown, ArrowUp } from "lucide-react";
import { tarotFont } from "../interpreter";
import { cn } from "lib/utils";

function OrientationPicker({ finalCard, onSubmit, switchOrientation }) {
  return (
    <div className="flex flex-col items-center justify-center pb-4 fade-in">
      <p className={cn("text-center text-xl", tarotFont.className)}>
        Is your card this way... <br />
        or that way?
      </p>
      <div className="flex items-center">
        <button onClick={switchOrientation}>
          <ArrowUp className="pulse-1 opacity-90" size={25} />
        </button>
        <button onClick={switchOrientation} className="mt-4 p-4">
          <div className="relative">
            <Card
              alt="Your Card"
              className={`${
                finalCard.orientation === "upright" ? "rotate-0" : "rotate-180"
              } transition-transform duration-700`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <IconRotate className="h-6 w-6 text-white" />
            </div>
          </div>
        </button>
        <button onClick={switchOrientation}>
          <ArrowDown className="pulse-2 opacity-90" size={25} />
        </button>
      </div>
      <div className="mt-4 flex w-full justify-around">
        <Button variant="default" className="w-1/3" onClick={switchOrientation}>
          Rotate
        </Button>
        <Button variant="outline" className="w-1/3" onClick={() => onSubmit(finalCard.name, finalCard.orientation)}>
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default OrientationPicker;
