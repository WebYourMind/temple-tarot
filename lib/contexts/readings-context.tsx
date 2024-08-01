import { CardInReading } from "lib/database/cardsInReadings.database";
import { Reading } from "lib/database/readings.database";
import { TarotSession } from "lib/database/tarotSessions.database";
import { useReadings } from "lib/hooks/use-readings";
import React, { ReactNode, createContext, useContext } from "react";

export interface ReadingsContextType {
  loading: boolean;
  error: Error | null;
  readings: TarotSession[];
  reading?: TarotSession;
  fetchReadings: (userId: string, page: number, limit: number) => Promise<void>;
  fetchReading: (id: string) => Promise<void>;
  addReading: (reading: Reading, cards: CardInReading[]) => Promise<void>;
  updateReading: (readingId: number, reading: Reading, cards: CardInReading[]) => Promise<void>;
  deleteReading: (readingId: number) => Promise<void>;
  setReadings: (readings: TarotSession[]) => void;
  setReading: (reading: TarotSession) => void;
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
