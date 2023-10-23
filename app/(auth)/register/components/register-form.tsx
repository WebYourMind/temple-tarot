"use client";
import { useState, type SyntheticEvent } from "react";
import AuthForm from "app/(auth)/components/auth-form";
import InputField from "app/(auth)/components/input-field";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <AuthForm isLoading={isLoading} onSubmit={onSubmit}>
      <InputField id="name" placeholder="Jane Doe" type="text" disabled={isLoading} label="Your Name" />
      <InputField id="email" placeholder="name@example.com" type="email" disabled={isLoading} label="Email" />
      <InputField id="password" placeholder="********" type="password" disabled={isLoading} label="Password" />
      <InputField
        id="confirm-password"
        placeholder="********"
        type="password"
        disabled={isLoading}
        label="Confirm Password"
      />
    </AuthForm>
  );
}
