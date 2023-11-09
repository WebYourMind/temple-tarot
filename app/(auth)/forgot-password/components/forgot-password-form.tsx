"use client";

import React, { useState, SyntheticEvent } from "react";
import InputField from "../../components/input-field";
import Link from "next/link";
import { useResponseMessage } from "lib/hooks/use-response-message";
import AuthForm from "app/(auth)/components/auth-form";

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
    <AuthForm isLoading={isLoading} onSubmit={handleSubmit} responseMessage={responseMessage}>
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
    </AuthForm>
  );
};

export default ForgotPasswordForm;
