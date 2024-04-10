"use client";

import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
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
import { useRouter } from "next/navigation";
import DeactivateAccount from "../edit/components/deactivate-account";
import { useProfile } from "lib/hooks/use-profile";

export default function ViewProfile() {
  const { profile, isLoading, emptyProfile } = useProfile();
  const route = useRouter();

  if (isLoading || !profile) {
    return <Loading message="Getting profile info..." />;
  }

  return (
    <div className="container mx-auto flex justify-center p-4">
      <div className="w-full max-w-md rounded-lg border p-6">
        <div className="mb-6 flex items-center space-x-4">
          <div className="flex h-16 w-16 shrink-0 select-none items-center justify-center rounded-full bg-muted text-lg font-medium uppercase text-foreground">
            {profile?.name ? getUserInitials(profile?.name) : null}
          </div>
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
        </div>
        <div className="grid space-y-3">
          <p className="flex items-center">
            <EnvelopeClosedIcon className="mr-2 h-5 w-5" /> {profile.email}
          </p>
          <p className="flex items-center">
            <MobileIcon className="mr-2 h-5 w-5" /> {profile.phone || "None"}
          </p>
          {profile.address === emptyProfile.address ? (
            <div className="flex flex-col">
              <p className="flex items-center">
                <HomeIcon className="mr-2 h-5 w-5" /> {profile.address.street}
              </p>
              <div className="ml-7">
                <p>
                  {profile.address.city}, {profile.address.state} {profile.address.postalCode}
                </p>
                <p>{profile.address.country}</p>
              </div>
            </div>
          ) : (
            <p className="flex items-center">
              <HomeIcon className="mr-2 h-5 w-5" /> None
            </p>
          )}
          <Button variant={"outline"} onClick={() => route.push("/profile/edit")}>
            <Pencil2Icon className="mr-2" />
            Edit Profile
          </Button>
          <Button variant={"outline"} onClick={() => route.push("/change-password")}>
            <LockClosedIcon className="mr-2" />
            Change Password
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"}>
                <ExclamationTriangleIcon className="mr-2" />
                Deactivate Account
              </Button>
            </DialogTrigger>
            <DeactivateAccount />
          </Dialog>
        </div>
      </div>
    </div>
  );
}
