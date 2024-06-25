// home/card-selection-wrapper.tsx
import React, { useState } from "react";
import CardSelection from "./card-selection";
import { useTarotSession } from "lib/contexts/tarot-session-context";

const ordinalLabels = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

const CardSelectionWrapper = () => {
  const { spreadType, query, setSelectedCards, selectedCards, setPhase } = useTarotSession();
  const [currentStep, setCurrentStep] = useState(0);

  const handleCardSelect = (card) => {
    const newSelectedCards = [...(selectedCards || []), card];
    setSelectedCards(newSelectedCards);

    if (currentStep < spreadType.numberOfCards - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase("reading");
    }
  };

  const cardOrdinal = ordinalLabels[currentStep] || (currentStep + 1).toString(); // Fallback to numbers if out of predefined range

  return (
    <>
      {spreadType.numberOfCards > 1 && <p className="text-center text-xs uppercase">{cardOrdinal} card</p>}
      <CardSelection onSelect={handleCardSelect} query={query} currentStep={currentStep} />
    </>
  );
};

export default CardSelectionWrapper;
