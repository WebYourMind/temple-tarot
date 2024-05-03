import { Button } from "components/ui/button";
import Card from "../tarot-card";
import { IconRotate } from "components/ui/icons";

function OrientationPicker({ finalCard, onSubmit, switchOrientation }) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <p className="text-center font-serif text-xl">Rotate your card as you feel intuitively.</p>
      <button
        onClick={switchOrientation}
        className="mt-4 p-4 transition-transform duration-300 ease-in-out hover:scale-110"
      >
        <div className="relative">
          <Card
            alt="Your Card"
            className={`${
              finalCard.orientation === "upright" ? "rotate-0" : "rotate-180"
            } transition-transform duration-500`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <IconRotate className="h-6 w-6 text-white" />
          </div>
        </div>
      </button>
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
