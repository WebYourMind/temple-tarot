"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "components/ui/button";
import InputField from "app/(auth)/components/input-field";
import toast from "react-hot-toast";
import { ArrowLeftIcon, ColorWheelIcon } from "@radix-ui/react-icons";
import { AsYouType } from "libphonenumber-js";
import AddressInput from "./address-input";
import { useRouter } from "next/navigation";
import { isValidEmail, isValidPhoneNumber } from "lib/utils";
import { useProfile } from "lib/hooks/use-profile";
import Loading from "components/loading";

export default function EditProfile() {
  const route = useRouter();
  const { data: session, update } = useSession() as any;
  const [isLoading, setIsLoading] = useState(false);

  const { profile, setProfile, isLoading: profileLoading } = useProfile();

  if (profileLoading || !profile) {
    return <Loading message="Getting profile info.." />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in profile.address) {
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const formattedPhoneNumber = new AsYouType().input(e.target.value);
    setProfile((prev) => ({ ...prev, phone: formattedPhoneNumber }));
  };

  const validateInput = () => {
    if (!profile.email || !isValidEmail(profile.email)) {
      toast.error("Please enter a valid email.");
      return false;
    }
    if (!profile.name || profile.name.trim().length === 0) {
      toast.error("Please enter your name.");
      return false;
    }

    if (profile.phone && !isValidPhoneNumber(profile.phone)) {
      toast.error("Please enter a valid phone number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    if (session?.user) {
      setIsLoading(true);
      const response = await fetch(`/api/profile/?userId=${session?.user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          user: profile,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        toast.success(data.message || "Profile updated successfully.");
        update();
      } else {
        const errorData = (await response.json()) as any;
        toast.error(errorData.error || "An error occurred while updating the profile.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center p-4">
      <Button className="mb-2" variant={"ghost"} onClick={() => route.push("/profile")}>
        <ArrowLeftIcon className="mr-2" />
        Back to profile
      </Button>
      <div className="w-full max-w-md rounded-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            placeholder="Jane Doe"
            label="* Your name:"
            name="name"
            type="text"
            id="name"
            value={profile.name}
            onChange={handleChange}
          />
          <InputField
            placeholder="jane@example.com"
            label="* Email address:"
            name="email"
            type="email"
            id="email"
            value={profile.email}
            onChange={handleChange}
          />
          <InputField
            placeholder="+1 234 567 8910"
            label="Phone number:"
            name="phone"
            type="tel"
            id="phone"
            value={profile.phone}
            onChange={handlePhoneChange}
          />
          <AddressInput address={profile.address} setAddress={handleChange} />
          <Button type="submit">
            {" "}
            {isLoading && <ColorWheelIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
