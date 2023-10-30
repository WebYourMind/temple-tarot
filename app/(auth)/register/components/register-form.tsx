"use client";
import { useState, SyntheticEvent } from "react";
import AuthForm from "app/(auth)/components/auth-form";
import InputField from "app/(auth)/components/input-field";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (password === confirmPassword) {
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

      if (res.status === 201) {
        router.push("/login");
        const result = await signIn("credentials", {
          redirect: false, // This option will prevent auto-redirects
          email,
          password,
          callbackUrl: "/api/auth/signin",
        });

        if (result?.error) {
          setError(result.error);
          setIsLoading(false);
        } else {
          router.replace("/");
        }
      } else if (data.error) {
        setError(data.error);
      }

      setIsLoading(false);
    } else {
      setError("Passwords don't match.");
    }
  }

  return (
    <AuthForm isLoading={isLoading} onSubmit={onSubmit} error={error}>
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