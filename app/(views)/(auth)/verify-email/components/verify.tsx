"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "components/loading";

const Verify = () => {
  const searchParams = useSearchParams();
  const [result, setResult] = useState("");

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = (await response.json()) as { message: string; error: string };
      if (response.ok) {
        setResult("Verified!");
        toast.success(data.message);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error("Verification failed. Please try again later.");
      setResult(error.message);
    }
  }, []);

  useEffect(() => {
    const token = searchParams?.get("token");
    if (token) {
      verifyEmail(token);
    } else {
      toast.error("No verification token found.");
    }
  }, [searchParams, verifyEmail]);

  if (result) {
    return (
      <div className="-mt-32 flex h-screen grow flex-col items-center justify-center">
        <p>{result}</p>
      </div>
    );
  }

  return <Loading message="Verifying email..." />;
};

export default Verify;
