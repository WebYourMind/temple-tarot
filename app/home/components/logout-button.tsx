"use client";
import { Button } from "components/ui/button";

export default function LogoutButton() {
  function logout() {
    console.log("logout");
  }
  return <Button onClick={logout}>Logout</Button>;
}
