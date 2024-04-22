"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Loading from "components/loading";
import { Button } from "components/ui/button";
import { useReadingsContext } from "lib/contexts/readings-context";
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
    <div className="container max-w-4xl pb-16 pt-8">
      <div className="mb-10">
        <Button className="p-0" variant={"link"} onClick={() => route.push("/readings")}>
          <ArrowLeftIcon className="mr-2" />
          My Readings
        </Button>
      </div>
      <div className="mx-auto max-w-4xl py-8 font-mono">
        <div className="flex flex-col">
          <p className="text-xs text-muted">{new Date(reading.createdAt).toDateString()}</p>
          <h1 className="my-4 text-4xl font-bold">{reading?.userQuery}</h1>
          <div className="my-8 text-lg">
            <h2 className="mb-2 text-xl font-bold">Cards:</h2>
            {reading.cards.map((card, index) => (
              <p key={card.cardName}>
                {/* <strong> */}
                {index + 1}. {card.cardName} ({card.orientation.charAt(0).toUpperCase() + card.orientation.slice(1)})
                {/* </strong> */}
              </p>
            ))}
          </div>
        </div>
        <ReactMarkdown className="prose prose-indigo mx-auto my-4 w-full max-w-full leading-relaxed text-foreground md:prose-lg">
          {reading.aiInterpretation}
        </ReactMarkdown>
      </div>
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
  console.log(reading);

  return <ReadingTemplate reading={reading} />;
}

export default Reading;
