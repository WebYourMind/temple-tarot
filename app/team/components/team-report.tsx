"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import Loading from "components/loading";
import { useTeamReport } from "lib/hooks/use-team-report";
import { Team, UserProfile } from "lib/types";
import { Button } from "components/ui/button";

type Props = {
  team: Team;
};

export default function TeamReport({ team }: Props) {
  const { teamReport, isLoading: reportLoading, isGenerating, generateReport } = useTeamReport(team.users, team);

  const isLoading = reportLoading;

  if (isLoading) {
    return <Loading message="Finding team report..." />;
  }

  if (!team.users) {
    return <p>No users found for team.</p>;
  }

  function findUsersWithoutDominantStyle(users: UserProfile[]) {
    return users.filter((user) => !user.dominantStyle || user.dominantStyle.trim() === "");
  }

  const usersWithoutDominantStyle = findUsersWithoutDominantStyle(team.users);

  const isWithoutTS = usersWithoutDominantStyle.length > 0;

  return (
    <div className="mx-auto my-20 flex max-w-4xl flex-col items-center space-y-10">
      {teamReport && (
        <>
          <ReactMarkdown className="prose prose-indigo text-foreground md:prose-lg">{`${teamReport}`}</ReactMarkdown>
          {!isGenerating && (
            <Button className="mt-10" onClick={generateReport}>
              Generate Another
            </Button>
          )}
        </>
      )}
      {!teamReport && (
        <Button onClick={generateReport} disabled={isWithoutTS}>
          Generate AI Insights
        </Button>
      )}
      {isWithoutTS && (
        <div className="w-80">
          <p className="font-bold">Waiting on Thinking Style results from the following team members:</p>
          <ul>
            {usersWithoutDominantStyle.map((user) => (
              <li key={user.id}>- {user.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
