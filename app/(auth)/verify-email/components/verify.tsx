"use client";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Message from "components/ui/message";
import { useResponseMessage } from "lib/hooks/use-response-message";

const Verify = () => {
  const searchParams = useSearchParams();
  const { responseMessage, showMessage } = useResponseMessage({
    message: "Verifying...",
    error: false,
  });

  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = (await response.json()) as { message: string; error: string };
        showMessage(data.message || data.error, data.error !== null); // TODO
      } catch (error) {
        showMessage("Verification failed. Please try again later.", true);
      }
    },
    [showMessage]
  );

  useEffect(() => {
    const token = searchParams?.get("token");
    if (token) {
      verifyEmail(token);
    } else {
      showMessage("No verification token found.", true);
    }
  }, [searchParams, showMessage, verifyEmail]);

  return <>{responseMessage.message && <Message error={responseMessage.error}>{responseMessage.message}</Message>}</>;
};

export default Verify;
