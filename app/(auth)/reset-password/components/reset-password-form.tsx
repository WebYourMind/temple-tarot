"use client";

import React, { SyntheticEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "app/(auth)/components/input-field";
import { Button } from "components/ui/button";
import { ColorWheelIcon } from "@radix-ui/react-icons";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const route = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);

    try {
      const token = searchParams;

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

      const endpoint = API_URL ? `${API_URL}/auth/password/reset` : "/api/auth/reset-password";

      const res = await fetch(endpoint, {
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
      setError("An error occurred while processing your request.");
    }
    setIsLoading(false);
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
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
              {error && <div className="rounded border border-red-500 p-2 text-red-500">{error}</div>}
              <Button disabled={isLoading}>
                {isLoading && <ColorWheelIcon className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Processing" : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
