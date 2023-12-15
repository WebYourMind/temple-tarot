"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import InputField from "app/(auth)/components/input-field";
import toast from "react-hot-toast";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import AuthPage from "app/(auth)/components/auth-page";
import { TeamForm } from "lib/types";

type CreateTeamProps = {
  isLoading: boolean;
  createTeam: (team: TeamForm) => void;
};

export default function CreateTeam({ isLoading, createTeam }: CreateTeamProps) {
  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function validateInput() {
    if (!teamForm.name || teamForm.name.trim().length === 0) {
      toast.error("Please enter your team name.");
      return false;
    }
    if (!teamForm.description || teamForm.description.trim().length === 0) {
      toast.error("Please enter your team description.");
      return false;
    }
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    await createTeam(teamForm);
  };

  return (
    <div className="container mx-auto flex flex-col items-center p-4 md:w-96">
      <AuthPage heading="Create your team" paragraph="Enhance your team dynamics.">
        <div className="w-full max-w-md rounded-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              placeholder="The Jedi Council"
              label="* Your team name:"
              name="name"
              type="text"
              id="name"
              value={teamForm.name}
              onChange={handleChange}
            />
            <InputField
              placeholder="Peacekeepers of the galaxy."
              label="* Your team description"
              name="description"
              type="text"
              id="description"
              value={teamForm.description}
              onChange={handleChange}
            />
            <Button type="submit">
              {" "}
              {isLoading && <ColorWheelIcon className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Processing" : "Create Team"}
            </Button>
          </form>
        </div>
      </AuthPage>
    </div>
  );
}
