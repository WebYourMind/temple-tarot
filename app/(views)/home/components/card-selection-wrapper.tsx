import React, { useState } from "react";
import CardSelection from "./card-selection";

const CardSelectionWrapper = ({ spread, query, onSelectComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardSelect = (cardName, orientation) => {
    const newSelectedCards = [...selectedCards, { cardName, orientation }];
    setSelectedCards(newSelectedCards);

    if (currentStep < spread.numberOfCards - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSelectComplete(newSelectedCards);
    }
  };

  return (
    <div>
      <p className="font-serif">
        Card {currentStep + 1} of {spread.numberOfCards}
      </p>
      <CardSelection onSelect={handleCardSelect} query={query} currentStep={currentStep} />
    </div>
  );
};

export default CardSelectionWrapper;
