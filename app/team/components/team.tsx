"use client";

import Loading from "components/loading";
import CreateTeam from "./create-team";
import { useTeam } from "lib/hooks/use-team";
import InviteLink from "./invite-link";
import { useSession } from "next-auth/react";
import Card from "components/card";
import ThinkingStyleDistribution from "./team-distribution";
import TeamMemberList from "./team-members";
import { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import InputField from "app/(auth)/components/input-field";

const teamMembers = [
  { name: "Michael Scott", email: "michael@dundermifflin.com", thinkingStyle: "Energizer" },
  { name: "Dwight Schrute", email: "dwight@dundermifflin.com", thinkingStyle: "Achiever" },
  { name: "Jim Halpert", email: "jim@dundermifflin.com", thinkingStyle: "Connector" },
  { name: "Pam Beesly", email: "pam@dundermifflin.com", thinkingStyle: "Nurturer" },
  { name: "Angela Martin", email: "angela@dundermifflin.com", thinkingStyle: "Optimizer" },
  { name: "Oscar Martinez", email: "oscar@dundermifflin.com", thinkingStyle: "Analyst" },
  { name: "Kevin Malone", email: "kevin@dundermifflin.com", thinkingStyle: "Designer" },
  { name: "Andy Bernard", email: "andy@dundermifflin.com", thinkingStyle: "Explorer" },
  { name: "Toby Flenderson", email: "toby@dundermifflin.com", thinkingStyle: "Nurturer" },
  { name: "Stanley Hudson", email: "stanley@dundermifflin.com", thinkingStyle: "Optimizer" },
];

export default function Team() {
  const { team, isLoading, createTeam, updateTeam, loadingMessage } = useTeam();
  const { data: session } = useSession() as any;
  const [editMode, setEditMode] = useState(false);
  const [teamName, setTeamName] = useState(team ? team.name : "");
  const [teamDescription, setTeamDescription] = useState(team ? team.description : "");

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
      setTeamDescription(team.description);
    }
  }, [team]);

  if (isLoading) {
    return <Loading message={loadingMessage} />;
  }

  if (!team) {
    return <CreateTeam isLoading={isLoading} createTeam={createTeam} />;
  }

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    updateTeam({ ...team, name: teamName, description: teamDescription });
    setEditMode(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:pt-16">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
        <div className="space-y-4 md:col-span-1">
          <Card>
            <div className="flex h-full flex-col items-center justify-center p-4">
              {editMode ? (
                <div className="space-y-4">
                  <InputField
                    placeholder="Team name..."
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                  <InputField
                    placeholder="Team description..."
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                  />
                  <Button onClick={handleSave}>Save</Button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl">{team.name}</h1>
                  <p className="italic text-muted-foreground">{team.description}</p>
                  {session?.user?.id !== team.adminId && (
                    <Button variant={"outline"} className="mt-4" onClick={handleEdit}>
                      Edit
                    </Button>
                  )}
                </>
              )}
            </div>
          </Card>

          <ThinkingStyleDistribution teamMembers={teamMembers} />
        </div>

        <div className="space-y-4 md:col-span-1">
          <TeamMemberList members={teamMembers} />
          <InviteLink team={team} inviterName={session?.user?.name} />
        </div>
      </div>
    </div>
  );
}
