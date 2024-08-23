"use client";

import TarotReadingSlides from "components/tarot-session/tarot-reading-slides";
import Loading from "app/loading";
import { useReadingsContext } from "lib/contexts/readings-context";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Interpreter from "components/tarot-session/interpreter";

type ReadingProps = {
  tarotSessionId: string;
};

function Reading({ tarotSessionId }: ReadingProps) {
  const { data: session, status } = useSession() as any;
  const { tarotSession, loading, error, fetchReading } = useReadingsContext();
  const { setAiResponse, setQuery, phase, selectedCards } = useTarotSession();

  useEffect(() => {
    if (session?.user?.id && tarotSessionId !== tarotSession?.id && phase !== "reading") {
      fetchReading(tarotSessionId);
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
