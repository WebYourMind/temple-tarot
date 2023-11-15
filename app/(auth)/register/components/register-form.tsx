"use client";
import { useState, SyntheticEvent } from "react";
import AuthForm from "app/(auth)/components/auth-form";
import InputField from "app/(auth)/components/input-field";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useResponseMessage } from "lib/hooks/use-response-message";

interface ResponseData {
  ok: boolean;
  token?: string;
  error?: string;
}

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { responseMessage, showMessage } = useResponseMessage({
    message: "",
    error: false,
  });
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const router = useRouter();

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (password === confirmPassword) {
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
          showMessage(result.error, true);
          setIsLoading(false);
        } else {
          router.replace("/");
        }
      } else if (data.error) {
        showMessage(data.error, true);
      }

      setIsLoading(false);
    } else {
      showMessage("Passwords don't match.", true);
    }
  }

  return (
    <AuthForm isLoading={isLoading} onSubmit={onSubmit} responseMessage={responseMessage}>
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
