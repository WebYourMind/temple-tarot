import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

const LumenContext = createContext({ lumens: 0, fetchLumenBalance: () => {}, isLoading: false });

export function useLumens() {
  return useContext(LumenContext);
}

export const LumenProvider = ({ children }: { children: ReactNode }) => {
  const [lumens, setLumens] = useState(0);
  const { data: session } = useSession() as any;
  const [isLoading, setIsLoading] = useState(true);

  async function fetchLumenBalance() {
    setIsLoading(true);
    const response = await fetch(`/api/lumens/?userId=${session.user.id}`);
    const data = (await response.json()) as any;

    if (response.ok) {
      setLumens(data.lumens);
    } else {
      toast.error(`Failed to fetch lumens.`);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (session) {
      fetchLumenBalance();
    }
  }, [session?.user]);

  return <LumenContext.Provider value={{ lumens, fetchLumenBalance, isLoading }}>{children}</LumenContext.Provider>;
};
