"use client";

import React, { useState, SyntheticEvent } from "react";
import InputField from "../../components/input-field";
import { Button } from "components/ui/button";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Message from "components/ui/message";
import { useResponseMessage } from "lib/useResponseMessage";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { responseMessage, showMessage } = useResponseMessage({
    message: "",
    error: false,
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await res.json()) as { message: string; error: string };
      if (res.status === 200) {
        showMessage(data.message);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      showMessage(error, true);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address below and we&apos;ll send you a link to reset it.
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <InputField
              id="email"
              placeholder="name@example.com"
              type="email"
              disabled={isLoading}
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Link href="/login" className="text-xs underline opacity-90">
              Back to login page
            </Link>
            {responseMessage.message && <Message error={responseMessage.error}>{responseMessage.message}</Message>}
            <Button disabled={isLoading}>
              {isLoading && <ColorWheelIcon className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Processing" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
