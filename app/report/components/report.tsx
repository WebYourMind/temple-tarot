"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";

export default function Report({ thinkingStyle, report: savedReport }: any) {
  const [report, setReport] = useState(savedReport?.report || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isSubscribed = true;
    const controller = new AbortController();

    async function generateReport() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ thinkingStyle }),
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
        }
      }
    }

    if (!savedReport.report && thinkingStyle) {
      generateReport();
    }

    // Cleanup function
    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [thinkingStyle, savedReport.report]); // Effect only runs if thinkingStyle changes

  function navToQuiz() {
    router.push("/quiz");
  }

  return (
    <div className="mx-auto my-20 max-w-4xl rounded-md bg-white">
      {thinkingStyle && isLoading && !report ? (
        <p>Loading report...</p>
      ) : (
        <ReactMarkdown className="prose prose-indigo prose-lg">{`${report}`}</ReactMarkdown>
      )}
      {!thinkingStyle && (
        <div className="mx-auto mt-5 flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <h1 className="text-2xl font-semibold tracking-tight">Nothing to see here...</h1>
          <p className="text-sm text-muted-foreground">
            First take the Thinking Styles Quiz and we&apos;ll show you the goods.
          </p>
          <Button onClick={navToQuiz}>Take Me To The Quiz</Button>
        </div>
      )}
    </div>
  );
}
