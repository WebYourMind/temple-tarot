"use client";

import Card from "components/card";
import { Reading } from "lib/database/readings.database";
import Link from "next/link";
import ReadingItemMenu from "./reading-item-menu";
import { useReadingsContext } from "lib/contexts/readings-context";
import { useRouter } from "next/navigation";

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
          <h3 className="truncate-text-2 font-bold">{reading.userQuery}</h3>
          <p className="text-xs text-primary">{reading.spreadType}</p>
          <p className="truncate-text-7 font-mono text-xs leading-relaxed">{reading.aiInterpretation}</p>
        </Link>
      </>
    </Card>
  );
}

export default ReadingItem;
