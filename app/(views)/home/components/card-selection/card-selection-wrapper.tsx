import React, { useState } from "react";
import CardSelection from "./card-selection";

const ordinalLabels = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
// const numberToWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

const CardSelectionWrapper = ({ spread, query, onSelectComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardSelect = (cardName, orientation) => {
    const newSelectedCards = [...selectedCards, { cardName, orientation }];
    setSelectedCards(newSelectedCards);

    if (currentStep < spread.numberOfCards - 1) {
      console.log(currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      onSelectComplete(newSelectedCards);
    }
  };

  const cardOrdinal = ordinalLabels[currentStep] || (currentStep + 1).toString(); // Fallback to numbers if out of predefined range
  // const totalCardsWord = numberToWords[spread.numberOfCards] || spread.numberOfCards.toString(); // Fallback to numbers if out of predefined range

  return (
    <div>
      <p className="text-center font-serif">{cardOrdinal.charAt(0).toUpperCase() + cardOrdinal.slice(1)} card</p>
      <CardSelection onSelect={handleCardSelect} query={query} currentStep={currentStep} />
    </div>
  );
};

export default CardSelectionWrapper;
