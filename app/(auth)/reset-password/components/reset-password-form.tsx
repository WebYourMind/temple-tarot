"use client";

import React, { SyntheticEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "app/(auth)/components/input-field";
import AuthForm from "app/(auth)/components/auth-form";
import { isPasswordComplex } from "lib/utils";
import toast from "react-hot-toast";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const route = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isPasswordComplex(password)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase and lowercase letters, numbers, and special characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const token = searchParams?.get("token");

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await res.json()) as { message: string; error: string };
      if (res.status === 200) {
        toast.success(data.message);
        route.push("/login");
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
        id="new-password"
        placeholder="Enter a new password"
        type="password"
        disabled={isLoading}
        label="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputField
        id="confirm-password"
        placeholder="Confirm your new password"
        type="password"
        disabled={isLoading}
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </AuthForm>
  );
}
