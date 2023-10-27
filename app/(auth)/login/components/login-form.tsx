"use client";
import { useState, type SyntheticEvent } from "react";
import { signIn } from "next-auth/react";
import AuthForm from "app/(auth)/components/auth-form";
import InputField from "app/(auth)/components/input-field";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    // const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

    // const endpoint = API_URL ? `${API_URL}/auth/signin` : "/api/auth/signin";

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
  }

  return (
    <AuthForm isLoading={isLoading} onSubmit={onSubmit} error={error}>
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
    </AuthForm>
  );
}
