import { useState, useCallback } from "react";

export function useSuggestedResponses() {
  const [suggestedResponses, setSuggestedResponses] = useState<string[] | null>();

  const generateResponses = useCallback(
    async (lastMessage: string) => {
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
    },
    [suggestedResponses]
  );

  return { suggestedResponses, generateResponses, setSuggestedResponses };
}
