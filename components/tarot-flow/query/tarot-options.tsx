import { InfoButton } from "components/info-dialog";
import DeckSelector from "./deck-selector";
import SpreadSelector from "./spread-selector";

function TarotOptions() {
  return (
    <div className="space-y-4 overflow-y-scroll">
      <div className="flex flex-col items-center justify-center space-y-4">
        <DeckSelector />
        <div className="flex w-full">
          <SpreadSelector />
          <InfoButton type="spread" />
        </div>
      </div>
    </div>
  );
}

export default TarotOptions;
