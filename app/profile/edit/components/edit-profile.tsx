"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserProfile } from "lib/types";
import { Button } from "components/ui/button";
import InputField from "app/(auth)/components/input-field";
import toast from "react-hot-toast";
import { ColorWheelIcon } from "@radix-ui/react-icons";

export default function EditProfile() {
  const { data: session, update } = useSession() as any;
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserProfile>({ name: "", email: "" });

  useEffect(() => {
    if (session) {
      setUserInfo({
        name: session.user?.name || "",
        email: session.user?.email || "",
      });
    }
  }, [session?.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateInput = () => {
    if (!userInfo.email || !userInfo.email.includes("@")) {
      toast.error("Please enter a valid email.");
      return false;
    }
    if (!userInfo.name || userInfo.name.trim().length === 0) {
      toast.error("Please enter your name.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    if (session?.user) {
      setIsLoading(true);
      const response = await fetch(`/api/profile/?userId=${session?.user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          user: userInfo,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        toast.success(data.message || "Profile updated successfully.");
        update();
      } else {
        const errorData = (await response.json()) as any;
        toast.error(errorData.error || "An error occurred while updating the profile.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            placeholder="Name"
            label="Name"
            name="name"
            type="text"
            id="name"
            value={userInfo.name}
            onChange={handleChange}
          />
          <InputField
            placeholder="Email"
            label="Email"
            name="email"
            type="email"
            id="email"
            value={userInfo.email}
            onChange={handleChange}
          />
          <Button type="submit">
            {" "}
            {isLoading && <ColorWheelIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Processing" : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
