import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

const CreditContext = createContext({ credits: 0, fetchCreditBalance: () => {}, isLoading: false });

export function useCredits() {
  return useContext(CreditContext);
}

export const CreditProvider = ({ children }: { children: ReactNode }) => {
  const [credits, setCredits] = useState(0);
  const { data: session } = useSession() as any;
  const [isLoading, setIsLoading] = useState(true);

  async function fetchCreditBalance() {
    setIsLoading(true);
    const response = await fetch(`/api/credits/?userId=${session.user.id}`);
    const data = (await response.json()) as any;

    if (response.ok) {
      setCredits(data.subscriptionCredits + data.additionalCredits);
    } else {
      toast.error(`Failed to fetch credits.`);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (session) {
      fetchCreditBalance();
    }
  }, [session?.user]);

  return <CreditContext.Provider value={{ credits, fetchCreditBalance, isLoading }}>{children}</CreditContext.Provider>;
};
