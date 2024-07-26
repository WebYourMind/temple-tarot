"use client";

import { Reading } from "lib/database/readings.database";
import { useReadingsContext } from "lib/contexts/readings-context";
import { useRouter } from "next/navigation";
import Card from "components/card";
import ReadingItemMenu from "./reading-item-menu";
import Link from "next/link";

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

  // let interpretationPreview = reading.aiInterpretation;

  // try {
  //   const parsedInterpretation = parseJsonSafe(reading.aiInterpretation) as { content: string }[];
  //   if (Array.isArray(parsedInterpretation) && parsedInterpretation.length > 0) {
  //     interpretationPreview = parsedInterpretation[0].content;
  //   }
  // } catch (error) {
  //   interpretationPreview = reading.aiInterpretation;
  // }
  return (
    <Card className="pt-6">
      <>
        <div className="flex items-center justify-between">
          <p className="mb-1 text-xs opacity-70">{new Date(reading.createdAt).toDateString()}</p>
          <ReadingItemMenu readingId={reading.id} />
        </div>
        <Link
          href={`readings/${reading.id}`}
          onClick={handleClick}
          className={"flex flex-col space-y-2 text-foreground"}
        >
          {reading.cards.map((card) => (
            <h3 key={card.cardName} className="my-0 text-primary">
              {card.cardName}
            </h3>
          ))}
          <p className="font-normal italic">{reading.userQuery || "Open Reading"}</p>
        </Link>
      </>
    </Card>
  );
}

export default ReadingItem;
