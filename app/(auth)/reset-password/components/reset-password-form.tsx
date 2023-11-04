"use client";

import React, { SyntheticEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "app/(auth)/components/input-field";
import { Button } from "components/ui/button";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import Message from "components/ui/message";
import { useResponseMessage } from "lib/useResponseMessage";

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
              {responseMessage.message && <Message error={responseMessage.error}>{responseMessage.message}</Message>}
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
