"use client";

import Loading from "components/loading";
import CreateTeam from "./create-team";
import { useTeam } from "lib/hooks/use-team";
import InviteLink from "./invite-link";
import { useSession } from "next-auth/react";

export default function Team() {
  const { team, isLoading, createTeam, loadingMessage } = useTeam();
  const { data: session } = useSession();

  if (isLoading) {
    return <Loading message={loadingMessage} />;
  }

  if (!team) {
    return <CreateTeam isLoading={isLoading} createTeam={createTeam} />;
  }

  return (
    <div className="container space-y-4 pt-8 md:pt-16">
      <h1 className="text-3xl">Team: {team.name}</h1>
      <InviteLink team={team} inviterName={session?.user?.name} />
    </div>
  );
}
