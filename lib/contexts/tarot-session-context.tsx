"use client";

import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState, useTransition } from "react";
import { track } from "@vercel/analytics/react";
import { useSession } from "next-auth/react";
import { infoMap } from "lib/tarot-data/info";
import tarotSpreads from "lib/tarot-data/tarot-spreads";
import { Reading } from "lib/database/readings.database";
import { CardInReading } from "lib/database/cardsInReadings.database";
import { TarotSession } from "lib/database/tarotSessions.database";
import { createTarotSession } from "app/actions/createTarotSession";
import { useRouter } from "next/navigation";
import TarotBack from "app/tarot-back.webp";

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

export type DeckType = { promptName: string; value: string; name: string };

interface TarotSessionContextProps {
  query: string;
  phase: "question" | "spread" | "cards" | "reading";
  selectedCards: CardInReading[] | null;
  selectedDeck: DeckType;
  spread: SpreadType;
  hasOwnCards: boolean;
  showInfo: boolean;
  infoContent: string;
  spreadPickerOpen: boolean;
  setQuery: React.Dispatch<React.SetStateAction<string | null>>;
  setPhase: React.Dispatch<React.SetStateAction<"question" | "spread" | "cards" | "reading">>;
  setSelectedCards: React.Dispatch<React.SetStateAction<CardInReading[] | null>>;
  setSelectedDeck: React.Dispatch<React.SetStateAction<DeckType>>;
  setSpread: React.Dispatch<React.SetStateAction<SpreadType>>;
  setHasOwnCards: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  setInfoContent: React.Dispatch<React.SetStateAction<string>>;
  setSpreadPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitQuestion: () => void;
  handleReset: (keepFollowUp?: boolean) => void;
  setInterpretationArray: React.Dispatch<React.SetStateAction<any>>;
  interpretationArray: any[];
  setAiResponse: React.Dispatch<React.SetStateAction<any>>;
  aiResponse: string;
  handleSubmitFollowUpQuestion: (drawCards?: boolean) => void;
  setIsFollowUp: React.Dispatch<React.SetStateAction<any>>;
  isFollowUp?: boolean;
  tarotSessionId?: string;
  onResponseComplete?: (reading: Reading) => void;
  addAiResponseToReading: (aiResponse: string) => void;
  followUpContext?: TarotSession;
  handleCreateTarotSession: () => void;
  isPending: boolean;
  storeLastUsedDeck: () => void;
  storeLastUsersName: () => void;
  usersName?: string;
  setUsersName?: Dispatch<SetStateAction<string>>;
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
  promptName: "Thoth 2.0 deck (see card definitions for interpretations)",
  value: "thoth_2",
  name: "Thoth 2.0 Deck",
};

export const TarotSessionProvider: React.FC<{
  children: React.ReactNode;
  isFollowUp?: boolean;
  tarotSessionId?: string;
  onResponseComplete?: (reading: Reading) => void;
  followUpContext?: TarotSession;
  isPropped?: boolean;
  addAiResponseToReading?: (aiResponse: string) => void;
}> = ({
  children,
  isFollowUp: isFollowUpProp = false,
  tarotSessionId = null,
  onResponseComplete,
  followUpContext,
  addAiResponseToReading,
}) => {
  const { data: userSession } = useSession() as any;
  const [query, setQuery] = useState<string>("");
  const [showInfo, setShowInfo] = useState(false);
  const [infoContent, setInfoContent] = useState(infoMap["question"]);
  const [phase, setPhase] = useState<"question" | "spread" | "cards" | "reading">("question");
  const [spreadPickerOpen, setSpreadPickerOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState<CardInReading[] | null>(null);
  const [selectedDeck, setSelectedDeck] = useState(defaultDeck);
  const [spread, setSpread] = useState<SpreadType>(tarotSpreads[0]); // To store the selected spread type
  const { data: session } = useSession() as { data: { user: { id: string } } };
  const [hasOwnCards, setHasOwnCards] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(isFollowUpProp);
  const [interpretationArray, setInterpretationArray] = useState<any>();
  const [aiResponse, setAiResponse] = useState<any>();
  const [usersName, setUsersName] = useState<string>(userSession?.user?.name || "");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // preload card back for card selection step
    const img = new Image();
    img.src = TarotBack.src;
  }, []);

  function getLastUsedDeck() {
    const storedDeck = localStorage.getItem("selectedDeck");
    if (storedDeck) {
      return JSON.parse(storedDeck) as { value: string; promptName: string; name: string };
    }
  }

  function storeLastUsedDeck() {
    localStorage.setItem("selectedDeck", JSON.stringify(selectedDeck));
  }

  function getUsersName() {
    const storedName = localStorage.getItem("usersName");
    return storedName;
  }

  function storeLastUsersName() {
    localStorage.setItem("usersName", usersName);
  }

  // Load selected deck from localStorage on component mount
  useEffect(() => {
    const storedDeck = getLastUsedDeck();
    setSelectedDeck(storedDeck || defaultDeck);

    const storedName = getUsersName();
    setSelectedDeck(storedDeck || defaultDeck);
  }, []);

  useEffect(() => {
    const storedName = getUsersName();
    if (storedName) {
      setUsersName(storedName);
    } else {
      setUsersName(userSession?.user?.name);
    }
  }, [userSession?.user?.name]);

  const handleCreateTarotSession = async () => {
    startTransition(async () => {
      try {
        const tarotSessionId = await createTarotSession();
        router.push(`/readings/${tarotSessionId}`);
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    });
  };

  function handleSubmitQuestion() {
    if (!hasOwnCards) {
      setPhase("cards");
      setInfoContent(infoMap["cards"]);
    } else {
      setPhase("reading");

      handleCreateTarotSession();

      // analytics
      track("Reading", { spread: spread.value, userId: session?.user?.id });
      selectedCards?.forEach((card) => {
        track("Cards", { cardName: card.cardName, orientation: card.orientation });
      });
    }
  }

  function handleSubmitFollowUpQuestion(drawCards: boolean) {
    if (!drawCards) {
      setPhase("reading");
    } else if (!hasOwnCards) {
      // or no cards
      setPhase("cards");
      setInfoContent(infoMap["cards"]);
    } else {
      setPhase("reading");

      // analytics
      track("Reading", { spread: spread.value, userId: session?.user?.id });
      selectedCards?.forEach((card) => {
        track("Cards", { cardName: card.cardName, orientation: card.orientation });
      });
    }
  }

  function handleReset(keepFollowUp = false) {
    setPhase("question");
    setSelectedCards(null);
    setQuery("");
    setInterpretationArray(null);
    setAiResponse(null);
    setHasOwnCards(false);
    setSelectedDeck(getLastUsedDeck());
    setSpread(tarotSpreads[0]);
    setIsFollowUp(keepFollowUp);
  }

  const value = {
    query,
    phase,
    selectedCards,
    selectedDeck,
    spread,
    hasOwnCards,
    showInfo,
    infoContent,
    spreadPickerOpen,
    setQuery,
    setPhase,
    setSelectedCards,
    setSelectedDeck,
    setSpread,
    setHasOwnCards,
    setShowInfo,
    setInfoContent,
    setSpreadPickerOpen,
    handleSubmitQuestion,
    handleSubmitFollowUpQuestion,
    handleReset,
    interpretationArray,
    setInterpretationArray,
    aiResponse,
    setAiResponse,
    isFollowUp,
    setIsFollowUp,
    tarotSessionId,
    onResponseComplete,
    followUpContext,
    handleCreateTarotSession,
    isPending,
    storeLastUsedDeck,
    addAiResponseToReading,
    usersName,
    setUsersName,
    storeLastUsersName,
  };

  return <TarotSessionContext.Provider value={value}>{children}</TarotSessionContext.Provider>;
};
