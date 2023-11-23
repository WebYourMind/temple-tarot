import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useScores(session: any) {
  const [scores, setScores] = useState(undefined);

  useEffect(() => {
    async function fetchScores() {
      const response = await fetch(`/api/quiz/?userId=${session.data?.user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch scores.");
      }
      const scoresData = (await response.json()) as any;
      setScores(scoresData.scores);
    }

    if (!scores && session?.data?.user) {
      fetchScores().catch((error) => {
        toast.error(`Error fetching scores: ${error.message}`);
      });
    }
  }, [session?.data?.user, scores]);

  return scores;
}
