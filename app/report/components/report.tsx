"use client";

import React, { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useScores } from "lib/hooks/use-scores";
import { useReport } from "lib/hooks/use-report";
import getPieChart from "lib/getPieChart";
import Loading from "components/loading";

export default function Report() {
  const router = useRouter();
  const session = useSession() as any;
  const { scores, isLoading: scoresLoading } = useScores(session);
  const { report, isLoading: reportLoading, isGenerating } = useReport(session, scores);

  const isLoading = scoresLoading || reportLoading;

  const navToQuiz = useCallback(() => {
    router.push("/quiz");
  }, [router]);

  if (isLoading) {
    return <Loading message="Finding report..." />;
  }

  if (!scores && !scoresLoading) {
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
      {report && scores && (
        <ReactMarkdown className="prose prose-indigo text-foreground md:prose-lg">
          {`${report}

${!isGenerating ? getPieChart(scores) : ""}
`}
        </ReactMarkdown>
      )}
      {!isGenerating && (
        <div className="flex flex-col space-y-5">
          <Button onClick={() => router.push("/")}>Chat With Ibis</Button>

          <Button variant={"outline"} onClick={navToQuiz}>
            Retake The Quiz
          </Button>
        </div>
      )}
    </div>
  );
}
