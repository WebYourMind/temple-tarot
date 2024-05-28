import React, { useState } from "react";
import CardSelection from "./card-selection";

const ordinalLabels = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

const CardSelectionWrapper = ({ spread, query, onSelectComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardSelect = (card) => {
    const newSelectedCards = [...selectedCards, card];
    setSelectedCards(newSelectedCards);

    if (currentStep < spread.numberOfCards - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSelectComplete(newSelectedCards);
    }
  };

  const cardOrdinal = ordinalLabels[currentStep] || (currentStep + 1).toString(); // Fallback to numbers if out of predefined range

  return (
    <div>
      <p className="text-center text-xs uppercase">{cardOrdinal} card</p>
      <CardSelection onSelect={handleCardSelect} query={query} currentStep={currentStep} />
    </div>
  );
};

export default CardSelectionWrapper;
