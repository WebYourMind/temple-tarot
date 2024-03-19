"use client";

import React, { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "app/(core)/(auth)/components/input-field";
import AuthForm from "app/(core)/(auth)/components/auth-form";
import { isPasswordComplex } from "lib/utils";
import toast from "react-hot-toast";

export default function ChangePasswordForm() {
  const route = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isPasswordComplex(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase and lowercase letters, numbers, and special characters."
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await res.json()) as { message: string; error: string };
      if (res.status === 200) {
        toast.success(data.message);
        route.push("/profile");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred while processing your request.");
    }
    setIsLoading(false);
  };

  return (
    <AuthForm isLoading={isLoading} onSubmit={handleSubmit}>
      <InputField
        id="old-password"
        placeholder="Enter your current password"
        type="password"
        disabled={isLoading}
        label="Current Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <InputField
        id="new-password"
        placeholder="Enter a new password"
        type="password"
        disabled={isLoading}
        label="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <InputField
        id="confirm-password"
        placeholder="Confirm your new password"
        type="password"
        disabled={isLoading}
        label="Confirm Password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />
    </AuthForm>
  );
}
