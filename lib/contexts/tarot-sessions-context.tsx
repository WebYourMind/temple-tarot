import { useTarotSessions } from "lib/hooks/use-tarot-sessions";
import { TarotSessionType } from "lib/types";
import React, { ReactNode, createContext, useContext } from "react";

export interface TarotSessionsContextType {
  loading: boolean;
  error: Error | null;
  tarotSessions: TarotSessionType[];
  tarotSession?: TarotSessionType;
  fetchTarotSessions: (userId: string, page: number, limit: number) => Promise<void>;
  fetchTarotSession: (id: string) => Promise<void>;
  setTarotSessions: (tarotSessions: TarotSessionType[]) => void;
  setTarotSession: (tarotSession: TarotSessionType) => void;
  totalPages: number;
}

const TarotSessionsContext = createContext<TarotSessionsContextType | undefined>(undefined);

export const useTarotSessionsContext = () => {
  const context = useContext(TarotSessionsContext);
  if (context === undefined) {
    throw new Error("useReadingsContext must be used within a ReadingsProvider");
  }
  return context;
};

export const TarotSessionsProvider = ({ children }: { children: ReactNode }) => {
  const tarotSessionsHooks = useTarotSessions();
  return <TarotSessionsContext.Provider value={tarotSessionsHooks}>{children}</TarotSessionsContext.Provider>;
};
