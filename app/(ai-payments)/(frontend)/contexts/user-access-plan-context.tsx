import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const UserAccessPlanContext = createContext({
  isSubscribed: false,
  passExpiry: null,
  hasAccess: false,
  fetchUserAccessPlan: () => {},
  isLoading: false,
});

export function useUserAccessPlan() {
  return useContext(UserAccessPlanContext);
}

interface UserAccessPlanData {
  passExpiry?: string;
  isSubscribed?: boolean;
  hasAccess?: boolean;
}

const fetchPassExpiry = async (): Promise<UserAccessPlanData> => {
  try {
    const response = await fetch("/api/user/passes");
    if (!response.ok) throw new Error("Failed to fetch user passes.");
    // @ts-ignore
    return response.json() as { passExpiry: string };
  } catch (error) {
    console.error("Fetching plans failed:", error);
    return null;
  }
};

export const UserAccessPlanProvider = ({ children }: { children: ReactNode }) => {
  const [isSubscribed, setIsSubscribed] = useState(undefined);
  const [passExpiry, setPassExpiry] = useState(undefined);
  const [hasAccess, setHasAccess] = useState(false);
  const { data: session } = useSession() as any;
  const [isLoading, setIsLoading] = useState(true);

  async function fetchUserAccessPlan() {
    setIsLoading(true);

    fetchPassExpiry().then((data) => {
      setPassExpiry(data.passExpiry);
      setIsSubscribed(data.isSubscribed);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    if (isSubscribed || (passExpiry && new Date(passExpiry) > new Date())) {
      setHasAccess(true);
    } else if (hasAccess) {
      setHasAccess(false);
    }
  }, [isSubscribed, passExpiry]);

  useEffect(() => {
    if (session) {
      fetchUserAccessPlan();
    }
  }, [session?.user]);

  return (
    <UserAccessPlanContext.Provider value={{ isSubscribed, passExpiry, hasAccess, fetchUserAccessPlan, isLoading }}>
      {children}
    </UserAccessPlanContext.Provider>
  );
};
