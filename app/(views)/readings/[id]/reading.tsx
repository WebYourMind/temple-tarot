"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { tarotFont } from "app/(views)/home/components/interpreter";
import FeedbackButtons from "app/(views)/home/components/reading-feedback";
import Loading from "components/loading";
import { Button } from "components/ui/button";
import { useReadingsContext } from "lib/contexts/readings-context";
import { cn } from "lib/utils";
import { StarIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

type ReadingProps = {
  readingId: string;
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
      <div className={cn("mx-auto max-w-4xl py-8", tarotFont.className)}>
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
          <ReactMarkdown className="prose prose-indigo mx-auto my-4 w-full max-w-full leading-relaxed text-foreground md:prose-lg">
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

function Reading({ readingId }: ReadingProps) {
  const { data: session, status } = useSession() as any;
  const { reading, loading, error, fetchReading } = useReadingsContext();

  useEffect(() => {
    if (session?.user?.id && readingId != reading?.id) {
      fetchReading(readingId);
    }
  }, [status]);

  if (loading || !reading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return <ReadingTemplate reading={reading} />;
}

export default Reading;
