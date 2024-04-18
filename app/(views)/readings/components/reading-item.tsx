"use client";

import Card from "components/card";
import { Reading } from "lib/database/readings.database";
import Link from "next/link";

type ReadingItemProps = {
  reading: Reading;
};

function ReadingItem({ reading }: ReadingItemProps) {
  return (
    <Card className="transition hover:scale-105">
      <Link href={`readings/${reading.id}`} className={"flex flex-col space-y-2"}>
        <p className="text-xs text-muted">{new Date(reading.createdAt).toDateString()}</p>

        <h3 className="truncate-text-2 font-bold">{reading.userQuery}</h3>
        <p className="truncate-text-7 font-mono text-xs">{reading.aiInterpretation}</p>
      </Link>
    </Card>
  );
}

export default ReadingItem;
