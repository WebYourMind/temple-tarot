"use client";

import React, { SyntheticEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "app/(auth)/components/input-field";
import { useResponseMessage } from "lib/hooks/use-response-message";
import AuthForm from "app/(auth)/components/auth-form";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const route = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { responseMessage, showMessage } = useResponseMessage({
    message: "",
    error: false,
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showMessage("Passwords do not match.", true);
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
        route.push("/login");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      showMessage("An error occurred while processing your request.", true);
    }
    setIsLoading(false);
  };

  return (
    <AuthForm isLoading={isLoading} onSubmit={handleSubmit} responseMessage={responseMessage}>
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
