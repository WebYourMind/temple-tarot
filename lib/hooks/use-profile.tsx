import { UserProfileType } from "lib/types";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useProfile() {
  const { data: session } = useSession() as any;
  const emptyProfile = {
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  };
  const [profile, setProfile] = useState<UserProfileType>(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUserProfile() {
      setIsLoading(true);
      const response = await fetch(`/api/profile`);
      const data = (await response.json()) as any;

      if (response.ok) {
        setProfile((prev) => ({
          ...prev,
          name: data.user?.name || "",
          email: data.user?.email || "",
          phone: data.user?.phone || "",
          address: {
            street: data.user?.address?.street || "",
            city: data.user?.address?.city || "",
            state: data.user?.address?.state || "",
            postalCode: data.user?.address?.postalCode || "",
            country: data.user?.address?.country || "",
          },
        }));
      } else {
        toast.error(`Failed to fetch profile.`);
      }
      setIsLoading(false);
    }
    if (session) {
      getUserProfile();
    }
  }, [session?.user]);

  return { profile, isLoading, setProfile, emptyProfile };
}
