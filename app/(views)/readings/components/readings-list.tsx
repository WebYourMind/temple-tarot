"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReadingItem from "./reading-item";
import { useTarotSessionsContext } from "lib/contexts/tarot-sessions-context";
import PaginationComponent from "./pagination-component";
import LoadingSkeleton from "./loading-skeleton";
import EmptyReadings from "./empty-readings";
import { cn } from "lib/utils";
import { MagicFont } from "components/tarot-flow/query/query-input";

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
  const { tarotSessions, loading, error, fetchTarotSessions, totalPages } = useTarotSessionsContext();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTarotSessions(session.user.id, page, 9);
    }
  }, [session?.user?.id, page]);

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

      {loading && tarotSessions?.length === 0 && <LoadingSkeleton />}
      {tarotSessions && (
        <>
          <div
            className={cn(
              "my-8 grid max-w-4xl grid-cols-1 gap-8 divide-y-2 divide-dotted md:my-20 md:grid-cols-3 md:divide-y-0 lg:grid-cols-3"
            )}
          >
            {tarotSessions.map(
              (reading) => reading.readings.length > 0 && <ReadingItem key={reading.id} tarotSession={reading} />
            )}
          </div>

          <div className="my-16">
            {totalPages > 1 && (
              <PaginationComponent pages={pages} page={page} totalPages={totalPages} onPaginate={handlePageChange} />
            )}
          </div>
        </>
      )}
    </>
  );
}
export default ReadingsList;
