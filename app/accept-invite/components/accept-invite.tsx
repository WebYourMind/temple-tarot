"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "components/loading";
import { Button } from "components/ui/button";
import Card from "components/card";
import toast from "react-hot-toast";
import { ApiResponse, Team } from "lib/types";
import { useProfile } from "lib/hooks/use-profile";

const AcceptInvite = () => {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession() as any;
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { profile } = useProfile();
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (profile?.teamId === team?.id) {
      router.replace("/team");
    }
  }, [profile, team]);

  useEffect(() => {
    async function getTeamPreview() {
      setLoading(true);
      const token = searchParams?.get("token");
      try {
        const response = await fetch(`/api/accept-invite?token=${token}`);
        if (!response.ok) {
          throw new Error();
        }
        const responseData = (await response.json()) as any;
        setTeam(responseData.data);
      } catch (err: any) {
        toast.error(`Failed to fetch team info.`);
      } finally {
        setLoading(false);
      }
    }

    const token = searchParams?.get("token");

    if (!session && status !== "loading") {
      // User is not logged in, redirect to login with redirect back to this page
      router.replace(`/login?redirect=/accept-invite?token=${token}`);
    } else if (session) {
      // User is logged in, proceed to show team preview
      getTeamPreview();
    }
  }, [session?.user?.id, status, searchParams]);

  if (loading || !team) {
    return <Loading />;
  }

  const handleJoinTeam = async () => {
    setLoading(true);

    if (!team?.id || !session?.user.id) return;

    const token = searchParams?.get("token");
    try {
      const response = await fetch("/api/accept-invite", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, teamId: team.id, userId: session.user.id }),
      });
      if (!response.ok) {
        throw new Error("Failed to join team.");
      } else {
        const responseData = (await response.json()) as unknown as ApiResponse;
        toast.success(responseData.message);
        router.push("/team");
      }
    } catch (err: any) {
      toast.error(`Failed to fetch team info.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-16 max-w-md">
      <Card className="max-w-md">
        <div className="align-center flex flex-col space-y-4">
          <h1 className="text-center text-2xl font-bold">You&apos;re invited to join.</h1>
          <div className="text-center">
            <h2 className="text-lg font-semibold">{team?.name}</h2>
            <p className="text-muted-foreground">{team?.description}</p>
          </div>
          <Button onClick={handleJoinTeam}>Join Team</Button>
          {profile.teamId && <p className="text-muted-foreground">(This will cause you to leave your current team)</p>}
        </div>
      </Card>
    </div>
  );
};

export default AcceptInvite;
