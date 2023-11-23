import { ArchetypeValues } from "lib/types";
import { haveMatchingArchetypeValues } from "lib/utils";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export function useReport(
  session: any,
  setIsLoading: (b: boolean) => void,
  setPageLoading: (b: boolean) => void,
  scores?: ArchetypeValues
) {
  const [report, setReport] = useState<string | undefined>(undefined);
  const [shouldGenerateReport, setShouldGenerateReport] = useState(false);

  useEffect(() => {
    async function getReport() {
      const response = await fetch(`/api/report/?userId=${session.data?.user.id}`);
      const data = (await response.json()) as any;

      if (response.ok) {
        if (haveMatchingArchetypeValues(scores as unknown as ArchetypeValues, data.report)) {
          setReport(data.report.report);
        } else {
          setShouldGenerateReport(true);
        }
      } else {
        setShouldGenerateReport(true);
      }
    }

    if (session?.data?.user && scores) {
      getReport();
    }
  }, [session?.data?.user, scores]);

  const generateReport = useCallback(async () => {
    let isSubscribed = true;
    const controller = new AbortController();
    setPageLoading(false);
    setIsLoading(true);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scores }),
        signal: controller.signal,
      });

      // Check if the request was successful
      if (!response.body) throw new Error("Failed to get the stream.");

      const reader = response.body.getReader();

      // Read the stream
      let receivedLength = 0; // received that many bytes at the moment
      let chunks = [] as any; // array of received binary chunks (comprises the body)
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsLoading(false);
          break;
        }

        chunks.push(value);
        receivedLength += value.length;

        // Decode chunks into report content as they come in
        const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
        if (isSubscribed) {
          setReport((prevReport: any) => prevReport + chunk);
        }
      }

      // Concatenate chunks into single Uint8Array
      let chunksAll = new Uint8Array(receivedLength); // (4.1)
      let position = 0;
      for (let chunk of chunks) {
        chunksAll.set(chunk, position); // (4.2)
        position += chunk.length;
      }

      // Decode into a string
      let result = new TextDecoder("utf-8").decode(chunksAll);

      // Process the result into state
      if (isSubscribed) {
        setReport(result);
      }
    } catch (error: any) {
      if (isSubscribed) {
        toast.error("Error fetching report: " + error.message);
        setIsLoading(false);
        setReport("Connection lost. Please refresh.");
      }
    }
  }, [scores]);

  return { report, shouldGenerateReport, generateReport };
}
