"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import Loading from "components/loading";
import { useTeamReport } from "lib/hooks/use-team-report";
import { Team } from "lib/types";
import { Button } from "components/ui/button";
import { countUsersWithStyles } from "lib/utils";

type Props = {
  team: Team;
};

export default function TeamReport({ team }: Props) {
  const { teamReport, isLoading: reportLoading, isGenerating, generateReport } = useTeamReport(team.id);

  const isLoading = reportLoading;

  if (isLoading) {
    return <Loading message="Finding team report..." />;
  }

  if (!team.users) {
    return <p>No users found for team.</p>;
  }

  const usersWithStyles = countUsersWithStyles(team.users);

  return (
    <div className="mx-auto my-20 flex max-w-4xl flex-col items-center space-y-10">
      {teamReport && (
        <>
          <ReactMarkdown className="prose prose-indigo text-foreground md:prose-lg">{`${teamReport}`}</ReactMarkdown>
        </>
      )}
      {usersWithStyles.length < 3 && (
        <div className="w-full space-y-4 text-center">
          <p className="text-center">
            To unlock a comprehensive analysis of your team&nbsp;s thinking styles, at least 3 team members need to
            complete the Thinking Style Quiz. This ensures a more accurate and meaningful insight into the collective
            dynamics and strengths of your team.
          </p>
          <p>
            <i>Currently, less than 3 members have completed the quiz.</i>
          </p>
        </div>
      )}
      {!teamReport && (
        <Button onClick={generateReport} disabled={usersWithStyles.length < 3}>
          Generate AI Insights
        </Button>
      )}
    </div>
  );
}
