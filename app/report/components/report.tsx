"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";
import { ColorWheelIcon } from "@radix-ui/react-icons";

export default function Report({ scores, report: savedReport }: any) {
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
        }
      }
    }

    if (!report && scores) {
      generateReport();
    }

    // Cleanup function
    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [scores]); // Effect only runs if thinkingStyle changes

  function navToQuiz() {
    router.push("/quiz");
  }

  if (!scores) {
    return (
      <div className="flex items-center justify-center">
        <div className="mt-5 flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <h1 className="text-2xl font-semibold tracking-tight">Nothing to see here...</h1>
          <p className="text-sm text-muted-foreground">
            First take the Thinking Styles Quiz and then we&apos;ll show you some insights.
          </p>
          <Button onClick={navToQuiz}>Take Me To The Quiz!</Button>
        </div>
      </div>
    );
  }

  const { explorer, analyst, designer, optimizer, connector, nurturer, energizer, achiever } = scores;

  // Convert string values to numbers and calculate the total score
  const totalScore = [explorer, analyst, designer, optimizer, connector, nurturer, energizer, achiever]
    .map((score) => parseFloat(score))
    .reduce((sum, current) => sum + current, 0);

  // Calculate relative percentages
  const relativePercentages = [explorer, analyst, designer, optimizer, connector, nurturer, energizer, achiever].map(
    (score) => ((parseFloat(score) / totalScore) * 100).toFixed(1)
  );

  const chartConfig = {
    type: "pie",
    data: {
      labels: ["Explorer", "Analyst", "Designer", "Optimizer", "Connector", "Nurturer", "Energizer", "Achiever"],
      datasets: [
        {
          data: relativePercentages,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          color: "white",
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  let stringChartConfig = JSON.stringify(chartConfig);
  // Manually append the formatter function as a string
  const formatterFunctionString = `,"formatter": function(value) { return value + '%' }`;
  stringChartConfig = stringChartConfig.replace(/("datalabels"\s*:\s*\{[^}]*\})/, `$1${formatterFunctionString}`);
  const encodedChartConfig = encodeURIComponent(stringChartConfig);
  const chartUrl = `https://quickchart.io/chart?c=${encodedChartConfig}`;

  return (
    <div className="mx-auto my-20 flex max-w-4xl flex-col items-center px-5">
      {scores && isLoading ? (
        <div className="flex h-96 flex-col items-center justify-center space-y-5 text-center">
          <p>
            Generating your report.<br></br>Please be patient.
          </p>
          <ColorWheelIcon className="mr-2 h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <ReactMarkdown className="prose prose-indigo md:prose-lg">
            {`${report}

![Pie Chart](${chartUrl})
`}
          </ReactMarkdown>

          <Button className="mt-10" onClick={navToQuiz}>
            Retake The Quiz
          </Button>
        </>
      )}
    </div>
  );
}
