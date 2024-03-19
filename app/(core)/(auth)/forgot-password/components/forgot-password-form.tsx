"use client";

import React, { useState, SyntheticEvent, useEffect } from "react";
import InputField from "../../components/input-field";
import Link from "next/link";
import AuthForm from "app/(core)/(auth)/components/auth-form";
import toast from "react-hot-toast";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInputValid, setIsInputValid] = useState<boolean>(false);

  // Validate email and password
  useEffect(() => {
    const validateInput = () => {
      // Basic validation: check if email and password are not empty
      const isValid = email.trim().length > 0;
      setIsInputValid(isValid);
    };

    validateInput();
  }, [email]);

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
        toast.success(data.message);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <AuthForm isLoading={isLoading} onSubmit={handleSubmit} isSubmitDisabled={!isInputValid}>
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
