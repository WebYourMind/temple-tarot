import { CardInReading, ReadingType, TarotSessionType } from "lib/types";
import { keysToCamel } from "lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";

export function useReadings() {
  const [tarotSessions, setTarotSessions] = useState<TarotSessionType[]>([]);
  const [tarotSession, setTarotSession] = useState<TarotSessionType>();
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReadings = async (userId, page, limit) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/readings/?userId=${userId}&page=${page}&limit=${limit}`);
      const data = (await response.json()) as any;

      setTarotSessions(keysToCamel(data.readings)); // Assume the response contains an array under 'readings'
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err as Error);
      console.error("Failed to fetch readings:", err);
    }
  };

  const fetchReading = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/readings/?readingId=${id}`);
      const data = (await response.json()) as any;
      if (response.ok) {
        setTarotSession(keysToCamel(data)); // Assume the response contains an array under 'readings'
      } else {
        toast.error(data.error.message);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err as Error);
      console.error("Failed to fetch readings:", err);
    }
  };

  const updateReading = async (readingId: number, reading: any, cards: any[]) => {
    setLoading(true);
    try {
      await fetch(`/api/readings/${readingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reading, cards }),
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err as Error);
      console.error("Failed to update reading:", err);
    }
  };

  const deleteReading = async (readingId: number) => {
    setLoading(true);
    try {
      await fetch(`/api/readings/${readingId}`, {
        method: "DELETE",
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err as Error);
      console.error("Failed to delete reading:", err);
    }
  };

  return {
    loading,
    error,
    fetchReadings,
    fetchReading,
    updateReading,
    deleteReading,
    tarotSessions,
    tarotSession,
    setTarotSessions,
    setTarotSession,
    totalPages,
  };
}
