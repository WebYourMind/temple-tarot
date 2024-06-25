import React, { createContext, useContext, useState } from "react";
import { track } from "@vercel/analytics/react";
import { useSession } from "next-auth/react";
import { infoMap } from "lib/tarot-data/info";
import tarotSpreads from "lib/tarot-data/tarot-spreads";

export type SpreadType = {
  numberOfCards: number;
  description: string;
  value: "single_card" | "three_card";
  name: string;
  cardMeanings: string[];
};

export type SelectedCardType = {
  cardName: string;
  orientation: string;
  imageUrl?: string;
  detail?: {};
  readingTips?: string;
  uprightGuidance?: string;
  reversedGuidance?: string;
};

interface TarotSessionContextProps {
  query: string;
  phase: "question" | "spread" | "cards" | "reading";
  selectedCards: SelectedCardType[] | null;
  selectedDeck: { promptName: string; value: string };
  spreadType: SpreadType;
  hasOwnCards: boolean;
  showInfo: boolean;
  infoContent: string;
  spreadPickerOpen: boolean;
  setQuery: React.Dispatch<React.SetStateAction<string | null>>;
  setPhase: React.Dispatch<React.SetStateAction<"question" | "spread" | "cards" | "reading">>;
  setSelectedCards: React.Dispatch<React.SetStateAction<SelectedCardType[] | null>>;
  setSelectedDeck: React.Dispatch<React.SetStateAction<{ promptName: string; value: string }>>;
  setSpreadType: React.Dispatch<React.SetStateAction<SpreadType>>;
  setHasOwnCards: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  setInfoContent: React.Dispatch<React.SetStateAction<string>>;
  setSpreadPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitQuestion: () => void;
  handleReset: () => void;
  setInterpretationArray: React.Dispatch<React.SetStateAction<any>>;
  interpretationArray: any[];
}

const TarotSessionContext = createContext<TarotSessionContextProps | undefined>(undefined);

export const useTarotSession = () => {
  const context = useContext(TarotSessionContext);
  if (context === undefined) {
    throw new Error("useTarotSession must be used within a TarotSessionProvider");
  }
  return context;
};

const defaultDeck = {
  promptName: "Toth 2.0 deck (see card definitions for interpretations)",
  value: "custom",
};

export const TarotSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string>("");
  const [showInfo, setShowInfo] = useState(false);
  const [infoContent, setInfoContent] = useState(infoMap["question"]);
  const [phase, setPhase] = useState<"question" | "spread" | "cards" | "reading">("question");
  const [spreadPickerOpen, setSpreadPickerOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState<SelectedCardType[] | null>(null);
  const [selectedDeck, setSelectedDeck] = useState(defaultDeck);
  const [spreadType, setSpreadType] = useState<any>(tarotSpreads[0]); // To store the selected spread type
  const { data: session } = useSession() as { data: { user: { id: string } } };
  const [hasOwnCards, setHasOwnCards] = useState(false);
  const [interpretationArray, setInterpretationArray] = useState<any>();

  function handleSubmitQuestion() {
    if (!hasOwnCards) {
      setPhase("cards");
      setInfoContent(infoMap["cards"]);
    } else {
      setPhase("reading");

      // analytics
      track("Reading", { spread: spreadType.value, userId: session?.user?.id });
      selectedCards?.forEach((card) => {
        track("Cards", { cardName: card.cardName, orientation: card.orientation });
      });
    }
  }

  function handleReset() {
    setPhase("question");
    setSelectedCards(null);
    setQuery("");
    setInterpretationArray(null);
    setHasOwnCards(false);
    setSelectedDeck(defaultDeck);
    setSpreadType(tarotSpreads[0]);
  }

  // This useEffect shows the info dialog automatically if it hasn't been seen by the user's device before.
  // useEffect(() => {
  //   const phaseKey = `hasSeenInfo-${phase}`;
  //   const hasSeenInfo = localStorage.getItem(phaseKey);

  //   // If it's the user's first time in this phase, show the info dialog
  //   setInfoContent(infoMap[phase] || infoMap["question"]);
  //   if (!hasSeenInfo && (phase === "cards" || phase === "question")) {
  //     setShowInfo(true);
  //     localStorage.setItem(phaseKey, "true"); // Mark this phase as seen
  //   }
  // }, [phase]);

  return (
    <TarotSessionContext.Provider
      value={{
        query,
        phase,
        selectedCards,
        selectedDeck,
        spreadType,
        hasOwnCards,
        showInfo,
        infoContent,
        spreadPickerOpen,
        setQuery,
        setPhase,
        setSelectedCards,
        setSelectedDeck,
        setSpreadType,
        setHasOwnCards,
        setShowInfo,
        setInfoContent,
        setSpreadPickerOpen,
        handleSubmitQuestion,
        handleReset,
        interpretationArray,
        setInterpretationArray,
      }}
    >
      {children}
    </TarotSessionContext.Provider>
  );
};
