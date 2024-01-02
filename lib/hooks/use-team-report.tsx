import { Team, UserProfile } from "lib/types";
import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";

export function useTeamReport(users: UserProfile[], team: Team) {
  const [teamReport, setTeamReport] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const isGeneratingRef = useRef(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = useCallback(async () => {
    if (isGeneratingRef.current || teamReport) return;
    isGeneratingRef.current = true;
    setIsGenerating(true);
    let isSubscribed = true;
    const controller = new AbortController();
    setIsLoading(true);
    try {
      const response = await fetch("/api/team-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users, team }),
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
          setTeamReport((prevReport) => prevReport + chunk);
        }
      }
    } catch (error: any) {
      if (isSubscribed) {
        toast.error("Error fetching report: " + error.message);
        setIsGenerating(false);
        setTeamReport("Connection lost. Please refresh.");
      }
    }

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [users, team, teamReport]);

  useEffect(() => {
    async function getReport() {
      if (teamReport || isGeneratingRef.current) return;
      setIsLoading(true);
      const response = await fetch(`/api/team-report/?teamId=${team.id}`);
      const data = (await response.json()) as any;

      if (response.ok) {
        setTeamReport(data.report.report);
      } else if (response.status === 404) {
        generateReport();
      } else {
        toast.error("Failed to fetch the report.");
      }
      setIsLoading(false);
    }

    if (team && users && !teamReport) {
      getReport();
    }
  }, [team, users, teamReport]);

  return { teamReport, isLoading, isGenerating };
}
