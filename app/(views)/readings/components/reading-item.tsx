"use client";

import Card from "components/card";
import { Reading } from "lib/database/readings.database";
import Link from "next/link";
import ReadingItemMenu from "./reading-item-menu";
import { useReadingsContext } from "lib/contexts/readings-context";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import tarotSpreads from "app/(views)/home/components/tarot-spreads";

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
  return (
    <Card>
      <>
        <div className="flex items-center justify-between">
          <p className="mb-4 text-xs text-muted">{new Date(reading.createdAt).toDateString()}</p>
          <ReadingItemMenu readingId={reading.id} />
        </div>
        <Link
          href={`readings/${reading.id}`}
          onClick={handleClick}
          className={"flex flex-col space-y-2 text-foreground"}
        >
          <h3 className="truncate-text-2 font-bold">{reading.userQuery || "Open Reading"}</h3>
          <p className="text-xs text-primary">
            {tarotSpreads.find((spread) => spread.value === reading.spreadType).name}
          </p>
          <ReactMarkdown allowedElements={["p"]} className="truncate-text-7 text-xs font-normal">
            {reading.aiInterpretation}
          </ReactMarkdown>
        </Link>
      </>
    </Card>
  );
}

export default ReadingItem;
