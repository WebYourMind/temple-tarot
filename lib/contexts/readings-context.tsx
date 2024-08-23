import { useReadings } from "lib/hooks/use-readings";
import { CardInReading, TarotSessionType } from "lib/types";
import React, { ReactNode, createContext, useContext } from "react";

export interface ReadingsContextType {
  loading: boolean;
  error: Error | null;
  tarotSessions: TarotSessionType[];
  tarotSession?: TarotSessionType;
  fetchReadings: (userId: string, page: number, limit: number) => Promise<void>;
  fetchReading: (id: string) => Promise<void>;
  updateReading: (readingId: number, reading: TarotSessionType, cards: CardInReading[]) => Promise<void>;
  deleteReading: (readingId: number) => Promise<void>;
  setTarotSessions: (tarotSessions: TarotSessionType[]) => void;
  setTarotSession: (tarotSession: TarotSessionType) => void;
  totalPages: number;
}

const ReadingsContext = createContext<ReadingsContextType | undefined>(undefined);

export const useReadingsContext = () => {
  const context = useContext(ReadingsContext);
  if (context === undefined) {
    throw new Error("useReadingsContext must be used within a ReadingsProvider");
  }
  return context;
};

export const ReadingsProvider = ({ children }: { children: ReactNode }) => {
  const readingsHooks = useReadings();
  return <ReadingsContext.Provider value={readingsHooks}>{children}</ReadingsContext.Provider>;
};
