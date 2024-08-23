"use client";

import TarotReadingSlides from "components/tarot-flow/interpretation/tarot-reading-slides";
import Loading from "app/loading";
import { useTarotSessionsContext } from "lib/contexts/tarot-sessions-context";
import { useTarotFlow } from "lib/contexts/tarot-flow-context";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Interpreter from "components/tarot-flow/interpretation/interpreter";

type ReadingProps = {
  tarotSessionId: string;
};

function Reading({ tarotSessionId }: ReadingProps) {
  const { data: session, status } = useSession() as any;
  const { tarotSession, loading, error, fetchTarotSession } = useTarotSessionsContext();
  const { setAiResponse, setQuery, phase, selectedCards } = useTarotFlow();

  useEffect(() => {
    if (session?.user?.id && tarotSessionId !== tarotSession?.id && phase !== "reading") {
      fetchTarotSession(tarotSessionId);
    }
  }, [status, phase]);

  useEffect(() => {
    if (tarotSession && tarotSession?.readings.length > 0) {
      if (tarotSession.readings[0].userQuery) setQuery(tarotSession.readings[0].userQuery);
      setAiResponse(tarotSession.readings[0].aiInterpretation);
    }

    return () => {
      setQuery("");
    };
  }, [tarotSession]);

  if (phase === "reading" && selectedCards) {
    return <Interpreter tarotSessionId={tarotSessionId} />;
  }

  if (loading || !tarotSession) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return <TarotReadingSlides tarotSessionId={tarotSessionId} />;
}

export default Reading;
