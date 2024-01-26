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
import { OptionsMenu } from "./options-menu";
import GenericDialog from "./generic-dialog";
import toast from "react-hot-toast";
import { Dialog } from "@radix-ui/react-dialog";
import { ApiResponse } from "lib/types";
import TeamReport from "./team-report";

export default function Team() {
  const { team, isLoading, createTeam, updateTeam, loadingMessage, setTeam } = useTeam();
  const { data: session, update, status } = useSession() as any;
  const [editMode, setEditMode] = useState(false);
  const [teamName, setTeamName] = useState(team ? team.name : "");
  const [teamDescription, setTeamDescription] = useState(team ? team.description : "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [removeMember, setRemoveMember] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
      setTeamDescription(team.description);
    }
  }, [team]);

  if (isLoading || status === "loading") {
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

  const handleLeaveTeam = async () => {
    setIsProcessing(true);
    try {
      const adminId = team.adminId;
      const teamId = team.id;
      const userId = session.user.id;
      const res = await fetch("/api/team/remove-user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId, userId, teamId }),
      });

      const data = (await res.json()) as ApiResponse;
      if (res.ok) {
        toast.success("Successfully left the team.");
        await update({ teamId: "remove" });
        setTeam(null);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error("Failed to leave team:", error);
      toast.error(error.message);
    }
    setLeaveDialogOpen(false);
    setIsProcessing(false);
  };

  const handleDeleteTeam = async () => {
    setIsProcessing(true);
    try {
      const adminId = session.user.id;
      const teamId = team.id;
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, adminId }),
      });

      const data = (await res.json()) as ApiResponse;
      if (res.ok) {
        toast.success("Team successfully deleted.");
        setTeam(null);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error("Failed to delete team:", error);
      toast.error(error.message);
    }
    setDeleteDialogOpen(false);
    setIsProcessing(false);
  };

  const initRemoveMember = (memberId: string) => {
    setRemoveMember(memberId);
    setRemoveDialogOpen(true);
  };

  const handleRemoveMember = async () => {
    setIsProcessing(true);
    try {
      const adminId = session.user.id;
      const teamId = team.id;
      const userId = removeMember;
      const res = await fetch("/api/team/remove-user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminId, userId, teamId }),
      });

      const data = (await res.json()) as ApiResponse;
      if (res.ok) {
        toast.success("Successfully removed team member.");
        setTeam((prevTeam) => {
          if (prevTeam === null) return null;

          const updatedUsers = prevTeam?.users?.filter((user) => user.id !== removeMember);
          return {
            ...prevTeam,
            users: updatedUsers,
          };
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error("Failed to remove team member:", error);
      toast.error(error.message);
    }
    setRemoveMember(null);
    setRemoveDialogOpen(false);
    setIsProcessing(false);
  };

  const isAdmin = session?.user?.id === team.adminId;

  return (
    <div className="container mx-auto px-4 py-8 md:pt-16">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
        <div className="space-y-4 md:col-span-1">
          <Card>
            <div className="flex h-full flex-col items-center justify-center p-4">
              {editMode ? (
                <div className="w-full space-y-4">
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
                  <div className="float-right space-x-4">
                    <Button variant={"secondary"} onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 text-center">
                  <h1 className="text-3xl">{team.name}</h1>
                  <p className="italic text-muted-foreground">{team.description}</p>
                  <OptionsMenu
                    isAdmin={isAdmin}
                    handleEdit={handleEdit}
                    openDeleteDialog={() => setDeleteDialogOpen(true)}
                    openLeaveDialog={() => setLeaveDialogOpen(true)}
                  />
                </div>
              )}
            </div>
          </Card>

          {team.users && <ThinkingStyleDistribution teamMembers={team.users} />}
          <InviteLink team={team} inviterName={session?.user?.name} />
        </div>

        <div className="space-y-4 md:col-span-1">
          {team.users && (
            <TeamMemberList
              members={team.users}
              handleRemove={initRemoveMember}
              isAdmin={isAdmin}
              adminId={team.adminId}
            />
          )}
        </div>
        <div className="md:col-span-2">
          <Card>
            <TeamReport team={team} />
          </Card>
        </div>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <GenericDialog
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete your team and remove related data from our servers."
          actionLabel={isProcessing ? "Deleting..." : "Delete My Team"}
          cancelLabel="Keep My Team"
          onAction={handleDeleteTeam}
          isProcessing={isProcessing}
        />
      </Dialog>
      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <GenericDialog
          title="Are you sure?"
          description="This action will remove you from the team."
          actionLabel={isProcessing ? "Leaving..." : "Leave Team"}
          cancelLabel="Cancel"
          onAction={handleLeaveTeam}
          isProcessing={isProcessing}
        />
      </Dialog>
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <GenericDialog
          title="Are you sure?"
          description="This action will remove the selected member from the team."
          actionLabel={isProcessing ? "Removing..." : "Remove Member"}
          cancelLabel="Cancel"
          onAction={handleRemoveMember}
          isProcessing={isProcessing}
        />
      </Dialog>
    </div>
  );
}
