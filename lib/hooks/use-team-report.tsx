import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";

export function useTeamReport(teamId: string) {
  const [teamReport, setTeamReport] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const isGeneratingRef = useRef(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = useCallback(async () => {
    if (isGeneratingRef.current) return;
    isGeneratingRef.current = true;
    setIsGenerating(true);
    let isSubscribed = true;
    const controller = new AbortController();
    try {
      const response = await fetch("/api/team-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) throw new Error(`Failed to generate team report: ${response.statusText}`);

      setTeamReport("");

      const reader = response.body.getReader();

      let receivedLength = 0;
      let chunks = [];
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsGenerating(false);
          isGeneratingRef.current = false;
          if (isSubscribed) {
            toast.success("New team report generated.");
          }
          break;
        }

        chunks.push(value);
        receivedLength += value.length;

        const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
        if (isSubscribed) {
          setTeamReport((prevReport) => prevReport + chunk);
        }
      }
    } catch (error: any) {
      if (isSubscribed) {
        // toast.error("Error fetching team report: " + error.message);
        setIsGenerating(false);
        setTeamReport("Connection lost. Please refresh.");
      }
    }

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [teamReport]);

  useEffect(() => {
    async function getReport() {
      if (teamReport || isGeneratingRef.current) return;
      setIsLoading(true);
      const response = await fetch(`/api/team-report/?teamId=${teamId}`);
      const data = (await response.json()) as any;

      if (response.ok) {
        setTeamReport(data.data.report);
      } else if (response.status !== 404) {
        toast.error("Failed to fetch the report.");
      }
      setIsLoading(false);
    }

    if (teamId && !teamReport) {
      getReport();
    }
  }, [teamReport, teamId]);

  return { teamReport, isLoading, isGenerating, generateReport };
}
