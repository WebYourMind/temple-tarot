"use client";

import Loading from "components/loading";
import CreateTeam from "./create-team";
import { useTeam } from "lib/hooks/use-team";

export default function Team() {
  const { team, isLoading, createTeam, loadingMessage } = useTeam();

  if (isLoading) {
    return <Loading message={loadingMessage} />;
  }

  if (!team) {
    return <CreateTeam isLoading={isLoading} createTeam={createTeam} />;
  }

  return (
    <div className="container pt-8 md:pt-16">
      <h1 className="text-3xl">Team: {team.name}</h1>
    </div>
  );
}
