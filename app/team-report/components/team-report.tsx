"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import Loading from "components/loading";
import { useTeamReport } from "lib/hooks/use-team-report";
import { Team } from "lib/types";

const team: Team = {
  id: "123",
  inviteToken: "1234",
  name: "Dunder Mifflin Scranton",
  description:
    "A branch of the Dunder Mifflin Paper Company managed by Michael Scott, known for its unique work culture and diverse personalities.",
  users: [
    {
      name: "Michael Scott",
      email: "",
      scores: {
        explorer: "0.8",
        analyst: "0.2",
        designer: "0.1",
        optimizer: "0.1",
        connector: "0.5",
        nurturer: "0.3",
        energizer: "0.7",
        achiever: "0.4",
      },
    },
    {
      name: "Dwight Schrute",
      email: "",
      scores: {
        explorer: "0.3",
        analyst: "0.6",
        designer: "0.4",
        optimizer: "0.7",
        connector: "0.2",
        nurturer: "0.1",
        energizer: "0.5",
        achiever: "0.9",
      },
    },
    {
      name: "Jim Halpert",
      email: "",
      scores: {
        explorer: "0.6",
        analyst: "0.4",
        designer: "0.5",
        optimizer: "0.3",
        connector: "0.7",
        nurturer: "0.2",
        energizer: "0.4",
        achiever: "0.6",
      },
    },
    {
      name: "Pam Beesly",
      email: "",
      scores: {
        explorer: "0.5",
        analyst: "0.3",
        designer: "0.6",
        optimizer: "0.4",
        connector: "0.7",
        nurturer: "0.8",
        energizer: "0.2",
        achiever: "0.4",
      },
    },
    {
      name: "Angela Martin",
      email: "",
      scores: {
        explorer: "0.2",
        analyst: "0.6",
        designer: "0.7",
        optimizer: "0.8",
        connector: "0.1",
        nurturer: "0.3",
        energizer: "0.2",
        achiever: "0.5",
      },
    },
    {
      name: "Oscar Martinez",
      email: "",
      scores: {
        explorer: "0.3",
        analyst: "0.8",
        designer: "0.4",
        optimizer: "0.7",
        connector: "0.3",
        nurturer: "0.4",
        energizer: "0.2",
        achiever: "0.6",
      },
    },
    {
      name: "Kevin Malone",
      email: "",
      scores: {
        explorer: "0.4",
        analyst: "0.3",
        designer: "0.2",
        optimizer: "0.5",
        connector: "0.5",
        nurturer: "0.6",
        energizer: "0.4",
        achiever: "0.2",
      },
    },
    {
      name: "Andy Bernard",
      email: "",
      scores: {
        explorer: "0.7",
        analyst: "0.3",
        designer: "0.4",
        optimizer: "0.3",
        connector: "0.6",
        nurturer: "0.4",
        energizer: "0.7",
        achiever: "0.5",
      },
    },
  ],
};

export default function TeamReport() {
  const router = useRouter();
  const { teamReport, isLoading: reportLoading, isGenerating } = useTeamReport(team.users, team);

  const isLoading = reportLoading;

  if (isLoading) {
    return <Loading message="Finding team report..." />;
  }

  return (
    <div className="mx-auto my-20 flex max-w-4xl flex-col items-center px-5">
      {teamReport && (
        <ReactMarkdown className="prose prose-indigo text-foreground md:prose-lg">
          {`${teamReport}
`}
        </ReactMarkdown>
      )}
    </div>
  );
}
