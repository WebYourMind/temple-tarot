"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Loading from "components/loading";
import { Button } from "components/ui/button";
import { useReadings } from "lib/hooks/use-readings";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

type ReadingProps = {
  readingId: string;
};

function Reading({ readingId }: ReadingProps) {
  const { data: session, status } = useSession() as any;
  const { reading, loading, error, fetchReading } = useReadings();
  const route = useRouter();

  useEffect(() => {
    if (session?.user?.id) {
      fetchReading(readingId);
    }
  }, [status]);

  if (loading || !reading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  console.log(reading);

  return (
    <div className="container max-w-4xl pt-4">
      <div className="">
        <Button className="p-0" variant={"link"} onClick={() => route.push("/readings")}>
          <ArrowLeftIcon className="mr-2" />
          My Readings
        </Button>
      </div>
      <div className="mx-auto max-w-2xl py-8">
        <div className="flex flex-col">
          <p className="my-4 italic">{reading.reading?.userQuery}</p>

          {reading.cards.map((card) => (
            <p className="my-3 text-lg" key={card.cardName}>
              <strong>{card.cardName}</strong> -{" "}
              <strong>{card.orientation.charAt(0).toUpperCase() + card.orientation.slice(1)}</strong>
            </p>
          ))}
        </div>
        <ReactMarkdown className="prose prose-indigo mx-auto my-6 w-full max-w-full font-mono leading-relaxed text-foreground md:prose-lg">
          {reading.reading.aiInterpretation}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default Reading;
