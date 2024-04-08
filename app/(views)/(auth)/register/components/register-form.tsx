"use client";
import { useState, SyntheticEvent, useEffect } from "react";
import AuthForm from "app/(views)/(auth)/components/auth-form";
import InputField from "app/(views)/(auth)/components/input-field";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
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
  const [isInputValid, setIsInputValid] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Validate email and password
  useEffect(() => {
    const validateInput = () => {
      // Basic validation: check if email and password are not empty
      const isValid =
        email.trim().length > 0 &&
        name.trim().length > 0 &&
        // name.trim().length < 30 &&
        password.trim().length > 0 &&
        confirmPassword.trim().length > 0;
      setIsInputValid(isValid);
    };

    validateInput();
  }, [name, email, password, confirmPassword]);

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

    const redirectUrl = searchParams?.get("redirect");

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
        callbackUrl: redirectUrl || "/",
      });

      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else if (redirectUrl) {
        router.replace(redirectUrl);
      } else {
        router.replace("/");
      }
    } else if (data.error) {
      toast.error(data.error);
    }

    setIsLoading(false);
  }

  return (
    <AuthForm isLoading={isLoading} onSubmit={onSubmit} isSubmitDisabled={!isInputValid}>
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
