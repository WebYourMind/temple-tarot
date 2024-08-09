"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReadingItem from "./reading-item";
import { useReadingsContext } from "lib/contexts/readings-context";
import PaginationComponent from "./pagination-component";
import LoadingSkeleton from "./loading-skeleton";
import EmptyReadings from "./empty-readings";
import { cn } from "lib/utils";
import { MagicFont } from "components/tarot-session/query/query-input";

function paginate(currentPage, pageCount, delta = 2) {
  const range = [];
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    range.unshift("...");
  }
  if (currentPage + delta < pageCount - 1) {
    range.push("...");
  }

  range.unshift(1);
  if (pageCount > 1) {
    range.push(pageCount);
  }

  return range;
}

function ReadingsList() {
  const { data: session } = useSession() as any;
  const { tarotSessions, loading, error, fetchReadings, totalPages } = useReadingsContext();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (session?.user?.id) {
      fetchReadings(session.user.id, page, 12);
    }
  }, [session?.user?.id, page]);

  if (loading && tarotSessions?.length === 0)
    return (
      <div className="my-16 md:my-20">
        <LoadingSkeleton />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  if ((!tarotSessions || tarotSessions?.length === 0) && !loading) {
    return <EmptyReadings />;
  }

  const handlePageChange = (newPage) => {
    if (newPage !== "...") {
      setPage(newPage);
    }
  };

  const pages = paginate(page, totalPages);

  return (
    <>
      <h1 className={cn("mb-8 font-sans text-3xl", MagicFont.className)}>Past Readings</h1>
      <div
        className={cn(
          "my-8 grid max-w-4xl grid-cols-1 gap-8 divide-y-2 divide-dotted md:my-20 md:grid-cols-3 md:divide-y-0 lg:grid-cols-3"
        )}
      >
        {tarotSessions &&
          tarotSessions.map(
            (reading) => reading.readings.length > 0 && <ReadingItem key={reading.id} tarotSession={reading} />
          )}
      </div>
      <div className="my-16">
        {totalPages > 1 && (
          <PaginationComponent pages={pages} page={page} totalPages={totalPages} onPaginate={handlePageChange} />
        )}
      </div>
    </>
  );
}
export default ReadingsList;
