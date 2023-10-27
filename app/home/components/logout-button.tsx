"use client";
import { Button } from "components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function LogoutButton() {
  const { data: session } = useSession();

  function logout() {
    signOut();
  }
  return (
    <>
      <p className="mb-6 max-w-2xl md:text-lg lg:mb-8 lg:text-xl">Welcome, {session?.user?.name}.</p>
      <Button onClick={logout}>Logout</Button>
    </>
  );
}
