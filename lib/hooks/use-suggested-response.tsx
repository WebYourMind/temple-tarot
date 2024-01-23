import { useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";

export function useSuggestedResponses() {
  const [suggestedResponses, setSuggestedResponses] = useState<string>("");
  const isGeneratingRef = useRef(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateResponses = useCallback(
    async (lastMessage: string) => {
      if (isGeneratingRef.current) return;
      isGeneratingRef.current = true;
      setIsGenerating(true);
      let isSubscribed = true;
      const controller = new AbortController();
      try {
        const response = await fetch("/api/suggested-responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lastMessage }),
        });

        if (!response.ok || !response.body)
          throw new Error(`Failed to generate suggested responses: ${response.statusText}`);

        const data = (await response.json()) as any;
        setSuggestedResponses(data.suggestedResponses);

        // const reader = response.body.getReader();

        // let receivedLength = 0;
        // let chunks = [];
        // while (true) {
        //   const { done, value } = await reader.read();

        //   if (done) {
        //     console.log(suggestedResponses);
        //     setIsGenerating(false);
        //     isGeneratingRef.current = false;
        //     break;
        //   }

        //   chunks.push(value);
        //   receivedLength += value.length;

        //   const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
        //   if (isSubscribed) {
        //     setSuggestedResponses((prevReport) => prevReport + chunk);
        //   }
        // }
      } catch (error: any) {
        if (isSubscribed) {
          // toast.error("Error fetching team report: " + error.message);
          setIsGenerating(false);
          setSuggestedResponses("Connection lost. Please refresh.");
        }
      }

      return () => {
        isSubscribed = false;
        controller.abort();
      };
    },
    [suggestedResponses]
  );

  return { suggestedResponses, isGenerating, generateResponses };
}
