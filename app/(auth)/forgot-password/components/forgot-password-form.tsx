"use client";

import React, { useState, SyntheticEvent } from "react";
import InputField from "../../components/input-field";
import { Button } from "components/ui/button";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

      const endpoint = API_URL ? `${API_URL}/auth/password/forgot` : "/api/auth/forgot-password";

      const res = await fetch(endpoint, {
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
        setMessage(data.message);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError("An error occurred while processing your request.");
    }
    setIsLoading(false);
  };

  return (
    <div className="pt-20 lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address below and we'll send you a link to reset it.
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
              {error && <div className="rounded border border-red-500 p-2 text-red-500">{error}</div>}
              {message && <div className="borderp-2 rounded">{message}</div>}
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
};

export default ForgotPasswordForm;
