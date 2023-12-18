"use client";
import { useState, SyntheticEvent } from "react";
import AuthForm from "app/(auth)/components/auth-form";
import InputField from "app/(auth)/components/input-field";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useResponseMessage } from "lib/hooks/use-response-message";
import { isPasswordComplex, isValidEmail } from "lib/utils";
import toast from "react-hot-toast";

interface ResponseData {
  ok: boolean;
  token?: string;
  error?: string;
}

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const router = useRouter();

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (!email || !isValidEmail(email)) {
      toast.error("Please enter a valid email.");
      return false;
    }

    if (!isPasswordComplex(password)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase and lowercase letters, numbers, and special characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    setIsLoading(true);

    const res = await fetch("/api/auth/register", {
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
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else {
        router.replace("/");
      }
    } else if (data.error) {
      toast.error(data.error);
    }

    setIsLoading(false);
  }

  return (
    <AuthForm isLoading={isLoading} onSubmit={onSubmit}>
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
