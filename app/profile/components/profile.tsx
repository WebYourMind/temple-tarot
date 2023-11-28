"use client";

export type UserProfile = {
  name: string;
  email: string;
  address: string;
  phone: string;
};

import {
  EnvelopeClosedIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  LockClosedIcon,
  MobileIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import Loading from "components/loading";
import { getUserInitials } from "components/navigation/user-menu";
import { Button } from "components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ViewProfile() {
  const { data: session } = useSession() as any;
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (session) {
      setProfile({
        name: session.user?.name || "",
        email: session.user?.email || "",
        address: session.user?.address || "None",
        phone: session.user?.phone || "None",
      });
    }
  }, [session]);

  if (!profile) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto flex justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6">
        <div className="mb-6 flex items-center space-x-4">
          <div className="flex h-16 w-16 shrink-0 select-none items-center justify-center rounded-full bg-muted/50 text-lg font-medium uppercase text-muted-foreground">
            {profile?.name ? getUserInitials(profile?.name) : null}
          </div>
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
        </div>
        <div className="grid space-y-3">
          <p className="flex items-center">
            <EnvelopeClosedIcon className="mr-2 h-5 w-5 text-gray-500" /> {profile.email}
          </p>
          <p className="flex items-center">
            <MobileIcon className="mr-2 h-5 w-5 text-gray-500" /> {profile.phone}
          </p>
          <p className="flex items-center">
            <HomeIcon className="mr-2 h-5 w-5 text-gray-500" /> {profile.address}
          </p>
          <Button variant={"outline"}>
            <Pencil2Icon className="mr-2" />
            Edit Profile
          </Button>
          <Button variant={"outline"}>
            <LockClosedIcon className="mr-2" />
            Change Password
          </Button>
          <Button variant={"destructive"}>
            <ExclamationTriangleIcon className="mr-2" />
            Deactivate Account
          </Button>
        </div>
      </div>
    </div>
  );
}
