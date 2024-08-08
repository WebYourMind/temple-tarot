"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import FeedbackButtons from "app/(views)/interpretation/reading-feedback";
import TarotReadingSlides from "components/tarot-session/tarot-reading-slides";
import Loading from "components/loading";
import { Button } from "components/ui/button";
import { useReadingsContext } from "lib/contexts/readings-context";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { cn, parseJsonSafe } from "lib/utils";
import { StarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Interpreter from "components/tarot-session/interpreter";

type ReadingProps = {
  tarotSessionId: string;
};

export function ReadingTemplate({ reading }) {
  const route = useRouter();
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 md:pt-8">
      <div>
        <Button className="p-0" variant={"link"} onClick={() => route.push("/readings")}>
          <ArrowLeftIcon className="mr-2" />
          My Readings
        </Button>
      </div>
      <div className={cn("mx-auto max-w-4xl py-8")}>
        <div className="flex flex-col">
          <p className="text-xs text-muted">{new Date(reading.createdAt).toDateString()}</p>
          <h1 className="my-4 text-4xl font-bold">{reading?.userQuery || "Open Reading"}</h1>
          <div className="md:text-lg">
            <h2 className="mb-2 text-xl font-bold">Cards:</h2>
            {reading.cards.map((card, index) => (
              <p key={card.cardName}>
                {index + 1}. {card.cardName} ({card.orientation.charAt(0).toUpperCase() + card.orientation.slice(1)})
              </p>
            ))}
          </div>
        </div>

        <ReactMarkdown className="my-16">---</ReactMarkdown>
        {reading.aiInterpretation ? (
          <ReactMarkdown className="prose prose-indigo mx-auto my-4 w-full max-w-full leading-relaxed text-foreground fade-in md:prose-lg">
            {reading.aiInterpretation}
          </ReactMarkdown>
        ) : (
          <StarIcon className="animate-spin-slow h-10 w-full text-center text-foreground" />
        )}
        <ReactMarkdown className="my-16">---</ReactMarkdown>
      </div>
      <FeedbackButtons content={reading.aiInterpretation} />
    </div>
  );
}

function Reading({ tarotSessionId }: ReadingProps) {
  const { data: session, status } = useSession() as any;
  const { tarotSession, loading, error, fetchReading } = useReadingsContext();
  const { setInterpretationArray, setAiResponse, setQuery, phase, selectedCards } = useTarotSession();

  useEffect(() => {
    console.log(phase);
    if (session?.user?.id && tarotSessionId != tarotSession?.id && phase !== "reading") {
      fetchReading(tarotSessionId);
    }
  }, [status, phase]);

  useEffect(() => {
    if (tarotSession && tarotSession?.readings.length > 0) {
      if (tarotSession.readings[0].userQuery) setQuery(tarotSession.readings[0].userQuery);
      const parsedInterpretation = parseJsonSafe(tarotSession.readings[0].aiInterpretation) as { content: string }[];
      if (Array.isArray(parsedInterpretation) && parsedInterpretation.length > 0) {
        setInterpretationArray(parsedInterpretation);
      } else {
        setAiResponse(tarotSession.readings[0].aiInterpretation);
      }
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
  console.log(tarotSession);
  return <TarotReadingSlides tarotSessionId={tarotSessionId} />;
}

export default Reading;
