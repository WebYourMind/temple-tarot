import { useState, useCallback, useEffect } from "react";

interface ResponseMessage {
  message: string;
  error: boolean;
}

export const useResponseMessage = (initialMessage: ResponseMessage = { message: "", error: false }) => {
  const [responseMessage, setResponseMessage] = useState<ResponseMessage>(initialMessage);

  const showMessage = useCallback((message: string, error: boolean = false) => {
    setResponseMessage({ message, error });
  }, []);

  useEffect(() => {
    return () => {
      setResponseMessage({ message: "", error: false });
    };
  }, []);

  return { responseMessage, showMessage };
};
