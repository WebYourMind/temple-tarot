import { CardInReading } from "lib/database/cardsInReadings.database";
import { Reading } from "lib/database/readings.database";
import { keysToCamel } from "lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";

export function useReadings() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [reading, setReading] = useState<Reading>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReadings = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/readings/?userId=${userId}`);
      const data = (await response.json()) as any;

      setReadings(keysToCamel(data.readings)); // Assume the response contains an array under 'readings'
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
        setReading(keysToCamel(data)); // Assume the response contains an array under 'readings'
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

  const addReading = async (reading: Reading, cards: CardInReading[]) => {
    setLoading(true);
    try {
      const response = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reading, cards }),
      });
      const data = await response.json();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err as Error);
      console.error("Failed to add reading:", err);
    }
  };

  const updateReading = async (readingId: number, reading: any, cards: any[]) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/readings/${readingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reading, cards }),
      });
      const data = await response.json();
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
      const response = await fetch(`/api/readings/${readingId}`, {
        method: "DELETE",
      });
      const data = await response.json();
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
    addReading,
    updateReading,
    deleteReading,
    readings,
    reading,
    setReadings,
    setReading,
  };
}
