"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import ReadingItem from "./reading-item";
import Loading from "components/loading";
import { useReadingsContext } from "lib/contexts/readings-context";

function Readings() {
  const { data: session, status } = useSession() as any;
  const { readings, loading, error, fetchReadings } = useReadingsContext();

  useEffect(() => {
    if (session?.user?.id) {
      fetchReadings(session.user?.id);
    }
  }, [status]);

  if (loading && !readings) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container max-w-4xl py-8 ">
      <h1 className="mb-8 text-2xl font-bold">My Readings</h1>
      <div className="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
        {readings && readings.map((reading) => <ReadingItem key={reading.id} reading={reading} />)}
      </div>
    </div>
  );
}
export default Readings;
