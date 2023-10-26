"use client";
import { useState, SyntheticEvent } from "react";
import AuthForm from "app/(auth)/components/auth-form";
import InputField from "app/(auth)/components/input-field";
import { signIn } from "next-auth/react";

interface ResponseData {
  ok: boolean;
  token?: string;
  error?: string;
}

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

    const endpoint = API_URL ? `${API_URL}/auth/register` : "/api/auth/register";

    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await res.json()) as ResponseData;

    if (data.ok) {
      const token = data.token;
      // use next-auth to handle token
      signIn("credentials", {
        callbackUrl: "/",
        token,
      });
    } else if (data.error) {
      setError(data.error);
    }

    setIsLoading(false);
  }

  return (
    <AuthForm isLoading={isLoading} onSubmit={onSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <InputField
        id="name"
        placeholder="Jane Doe"
        type="text"
        disabled={isLoading}
        label="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <InputField
        id="email"
        placeholder="name@example.com"
        type="email"
        disabled={isLoading}
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        id="password"
        placeholder="********"
        type="password"
        disabled={isLoading}
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputField
        id="confirm-password"
        placeholder="********"
        type="password"
        disabled={isLoading}
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </AuthForm>
  );
}
