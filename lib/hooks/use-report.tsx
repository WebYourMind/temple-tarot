import { Score } from "lib/quiz";
import { haveMatchingArchetypeValues } from "lib/utils";
import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";

export function useReport(session: any, scores?: Score) {
  const [report, setReport] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const isGeneratingRef = useRef(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = useCallback(async () => {
    if (isGeneratingRef.current || report) return;
    isGeneratingRef.current = true;
    setIsGenerating(true);
    let isSubscribed = true;
    const controller = new AbortController();
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

      if (!response.body) throw new Error("Failed to get the stream.");

      const reader = response.body.getReader();

      let receivedLength = 0;
      let chunks = [];
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsGenerating(false);
          break;
        }

        chunks.push(value);
        receivedLength += value.length;

        const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
        if (isSubscribed) {
          setReport((prevReport) => prevReport + chunk);
        }
      }
    } catch (error: any) {
      if (isSubscribed) {
        toast.error("Error fetching report: " + error.message);
        setIsGenerating(false);
        setReport("Connection lost. Please refresh.");
      }
    }

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [scores, report]);

  useEffect(() => {
    async function getReport() {
      if (report || isGeneratingRef.current) return;
      setIsLoading(true);
      const response = await fetch(`/api/report/?userId=${session.data?.user.id}`);
      const data = (await response.json()) as any;

      if (response.ok) {
        if (haveMatchingArchetypeValues(scores as Score, data.report)) {
          setReport(data.report.report);
        } else {
          generateReport();
        }
      } else {
        generateReport();
      }
      setIsLoading(false);
    }

    if (scores && !report) {
      getReport();
    }
  }, [scores, report]);

  return { report, isLoading, isGenerating };
}
