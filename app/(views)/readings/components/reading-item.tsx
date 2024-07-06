"use client";

import Card from "components/card";
import { Reading } from "lib/database/readings.database";
import Link from "next/link";
import ReadingItemMenu from "./reading-item-menu";
import { useReadingsContext } from "lib/contexts/readings-context";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import tarotSpreads from "lib/tarot-data/tarot-spreads";
import { parseJsonSafe } from "lib/utils";

type ReadingItemProps = {
  reading: Reading;
};

function ReadingItem({ reading }: ReadingItemProps) {
  const { setReading } = useReadingsContext();
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    setReading(reading);
    router.push(`/readings/${reading.id}`);
  };

  let interpretationPreview = reading.aiInterpretation;

  try {
    const parsedInterpretation = parseJsonSafe(reading.aiInterpretation) as { content: string }[];
    if (Array.isArray(parsedInterpretation) && parsedInterpretation.length > 0) {
      interpretationPreview = parsedInterpretation[0].content;
    }
  } catch (error) {
    interpretationPreview = reading.aiInterpretation;
  }
  console.log(reading);
  return (
    <Card className="pt-6">
      <>
        <div className="flex items-center justify-between">
          <p className="mb-1 text-xs text-muted">{new Date(reading.createdAt).toDateString()}</p>
          <ReadingItemMenu readingId={reading.id} />
        </div>
        <Link
          href={`readings/${reading.id}`}
          onClick={handleClick}
          className={"flex flex-col space-y-2 text-foreground"}
        >
          {/* <h3 className="truncate-text-2 font-bold">{reading.userQuery || "Open Reading"}</h3> */}
          {reading.cards.map((card) => (
            <h3 className="my-0 text-primary">{card.cardName}</h3>
          ))}
          {/* <p className="text-xs text-primary">
            {tarotSpreads.find((spread) => spread.value === reading.spreadType).name}
          </p> */}
          <p className="font-normal italic">{reading.userQuery || "Open Reading"}</p>
          {/* <ReactMarkdown allowedElements={["p"]} className="truncate-text-7 text-base font-normal">
            {interpretationPreview}
          </ReactMarkdown> */}
        </Link>
      </>
    </Card>
  );
}

export default ReadingItem;
