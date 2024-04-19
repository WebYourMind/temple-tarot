"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReadingItem from "./reading-item";
import Loading from "components/loading";
import { useReadingsContext } from "lib/contexts/readings-context";
import PaginationComponent from "./pagination-component";

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

function Readings() {
  const { data: session } = useSession() as any;
  const { readings, loading, error, fetchReadings, totalPages } = useReadingsContext();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (session?.user?.id) {
      fetchReadings(session.user.id, page, 12);
    }
  }, [session?.user?.id, page]);

  if (loading && !readings) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (readings?.length === 0 && !loading) {
    return <div>No readings found.</div>;
  }

  const handlePageChange = (newPage) => {
    if (newPage !== "...") {
      setPage(newPage);
    }
  };

  const pages = paginate(page, totalPages);

  return (
    <div className="container max-w-4xl py-8 ">
      <h1 className="mb-8 text-2xl font-bold">My Readings</h1>
      <div className="mb-8 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
        {readings && readings.map((reading) => <ReadingItem key={reading.id} reading={reading} />)}
      </div>
      {totalPages > 1 && (
        <PaginationComponent pages={pages} page={page} totalPages={totalPages} onPaginate={handlePageChange} />
      )}
    </div>
  );
}
export default Readings;
