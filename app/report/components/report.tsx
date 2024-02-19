"use client";

import React, { useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useScores } from "lib/hooks/use-scores";
import { useReport } from "lib/hooks/use-report";
import Loading from "components/loading";
import ArchetypePieChart from "lib/ArchetypePieChart";
import { useFeedback } from "app/feedback-data";

export default function Report() {
  const router = useRouter();
  const session = useSession() as any;
  const { includeData } = useFeedback();
  const { scores, isLoading: scoresLoading } = useScores(session);
  const { report, isLoading: reportLoading, isGenerating } = useReport(session, scores);

  const isLoading = scoresLoading || reportLoading;

  useEffect(() => {
    if (report && !isGenerating) {
      includeData({ type: "Insight Report", subject: JSON.stringify(report) });
    }

    return () => {
      includeData({ type: "", subject: undefined });
    };
  }, [report, isGenerating]);

  const navToQuiz = useCallback(() => {
    router.push("/quiz");
  }, [router]);

  if (isLoading) {
    return <Loading message="Finding report..." />;
  }

  if (!scores && !scoresLoading) {
    return (
      <div className="container flex items-center justify-center">
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
        <div>
          <ReactMarkdown className="prose prose-indigo text-foreground md:prose-lg">
            {`${report}
`}
          </ReactMarkdown>
          {!isGenerating && <ArchetypePieChart scores={scores} />}
        </div>
      )}
      {!isGenerating && (
        <div className="flex flex-col space-y-5">
          <Button onClick={() => router.push("/")}>Chat With IBIS</Button>

          <Button variant={"outline"} onClick={navToQuiz}>
            Retake The Quiz
          </Button>
        </div>
      )}
    </div>
  );
}
