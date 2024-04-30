import { Button } from "components/ui/button";
import Card from "../tarot-card";
import { IconRotate } from "components/ui/icons";

function OrientationPicker({ switchOrientation, finalCard, onSubmit }) {
  return (
    <>
      <p className="mb-4 max-w-sm text-center font-serif text-xl md:mb-10">Which way is your card?</p>
      <button onClick={() => switchOrientation()} className="p-4 transition hover:scale-105">
        <div className="rounded-lg">
          <Card
            alt={"Your Card"}
            className={`${finalCard.orientation === "upright" ? "rotate-0" : "rotate-180"} shadow-none transition`}
          />
        </div>
      </button>
      <Button variant="ghost" size="icon" className="p-2" onClick={() => switchOrientation()}>
        <IconRotate className="h-8 w-8" />
      </Button>
      <Button className="mt-4" variant="outline" onClick={() => onSubmit(finalCard.name, finalCard.orientation)}>
        CONFIRM
      </Button>
    </>
  );
}

export default OrientationPicker;
