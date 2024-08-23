import { TarotSessionType } from "lib/types";
import { keysToCamel } from "lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";

export function useTarotSessions() {
  const [tarotSessions, setTarotSessions] = useState<TarotSessionType[]>([]);
  const [tarotSession, setTarotSession] = useState<TarotSessionType>();
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTarotSessions = async (userId, page, limit) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tarot-sessions/?userId=${userId}&page=${page}&limit=${limit}`);
      const data = (await response.json()) as any;

      setTarotSessions(keysToCamel(data.readings));
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err as Error);
      console.error("Failed to fetch readings:", err);
    }
  };

  const fetchTarotSession = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tarot-sessions/?readingId=${id}`);
      const data = (await response.json()) as any;
      if (response.ok) {
        setTarotSession(keysToCamel(data));
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

  return {
    loading,
    error,
    fetchTarotSessions,
    fetchTarotSession,
    tarotSessions,
    tarotSession,
    setTarotSessions,
    setTarotSession,
    totalPages,
  };
}
