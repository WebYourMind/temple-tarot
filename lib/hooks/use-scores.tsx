import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useScores(session: any) {
  const [scores, setScores] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    async function fetchScores() {
      setIsLoading(true);
      const response = await fetch(`/api/quiz/?userId=${session.data?.user.id}`);
      if (!response.ok && response.status !== 404) {
        throw new Error("Failed to fetch scores.");
      }
      const scoresData = (await response.json()) as any;
      setScores(scoresData.scores);
      setIsLoading(false);
    }

    if (!fetchAttempted && session?.data?.user && !scores) {
      fetchScores()
        .catch((error) => {
          toast.error(`Error fetching scores: ${error.message}`);
        })
        .finally(() => {
          setIsLoading(false);
          setFetchAttempted(true);
        });
    }
  }, [session?.data?.user, fetchAttempted, scores]);

  return { scores, isLoading };
}
