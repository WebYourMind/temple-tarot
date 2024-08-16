import React, { useState } from "react";
import CardSelection from "./card-selection";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { Button } from "components/ui/button";
import { IconClose } from "components/ui/icons";

const ordinalLabels = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

const CardSelectionWrapper = () => {
  const {
    spread,
    query,
    selectedDeck,
    setSelectedCards,
    selectedCards,
    setPhase,
    handleCreateTarotSession,
    isFollowUp,
    handleReset,
  } = useTarotSession();
  const [currentStep, setCurrentStep] = useState(0);

  const handleCardSelect = (card) => {
    const newSelectedCards = [...(selectedCards || []), { ...card, deck: selectedDeck.value }];
    setSelectedCards(newSelectedCards);

    if (currentStep < spread.numberOfCards - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase("reading");
      if (!isFollowUp) {
        handleCreateTarotSession();
      }
    }
  };

  const cardOrdinal = ordinalLabels[currentStep] || (currentStep + 1).toString(); // Fallback to numbers if out of predefined range

  function handleClose() {
    handleReset(isFollowUp);
  }

  return (
    <div className="flex max-h-screen flex-col">
      <div className="w-full px-2">
        <Button variant="ghost" size="icon" onClick={handleClose} className="float-right rounded-full">
          <IconClose />
        </Button>
      </div>
      {spread.numberOfCards > 1 && <p className="text-center text-xs uppercase">{cardOrdinal} card</p>}
      <CardSelection onSelect={handleCardSelect} query={query} currentStep={currentStep} />
    </div>
  );
};

export default CardSelectionWrapper;
