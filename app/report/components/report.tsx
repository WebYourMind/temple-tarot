"use client";

import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useScores } from "lib/hooks/use-scores";
import { useReport } from "lib/hooks/use-report";
import getPieChart from "lib/getPieChart";

export default function Report() {
  const router = useRouter();
  const session = useSession() as any;
  const scores = useScores(session);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { report, shouldGenerateReport, generateReport } = useReport(session, setIsLoading, setPageLoading, scores);

  useEffect(() => {
    if (report) {
      setPageLoading(false);
    } else if (shouldGenerateReport) {
      generateReport();
    }
  }, [report, shouldGenerateReport]);

  const navToQuiz = useCallback(() => {
    router.push("/quiz");
  }, [router]);

  if (pageLoading) {
    return (
      <div className="mt-5 flex items-center justify-center">
        <ColorWheelIcon className="mr-2 h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!scores) {
    return (
      <div className="flex items-center justify-center">
        <div className="mt-5 flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <h1 className="text-2xl font-semibold tracking-tight">Ready to Discover Your Thinking Style?</h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s get started with the Thinking Styles Quiz! Complete the quiz and unlock valuable insights
            tailored just for you.
          </p>
          <Button onClick={navToQuiz}>Start the Quiz Now!</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-20 flex max-w-4xl flex-col items-center px-5">
      {scores && isLoading ? (
        <div className="flex h-96 flex-col items-center justify-center space-y-5 text-center">
          <p>
            Your personalized report is currently being crafted!<br></br>Please stay on this page while we work our
            magic.
          </p>
          <ColorWheelIcon className="mr-2 h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <ReactMarkdown className="prose prose-indigo md:prose-lg">
            {`${report}

${getPieChart(scores)}
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
