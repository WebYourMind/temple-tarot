"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserProfile } from "lib/types";
import { Button } from "components/ui/button";
import InputField from "app/(auth)/components/input-field";
import toast from "react-hot-toast";
import { ArrowLeftIcon, ColorWheelIcon } from "@radix-ui/react-icons";
import { AsYouType } from "libphonenumber-js";
import AddressInput from "./address-input";
import { useRouter } from "next/navigation";
import { isValidEmail, isValidPhoneNumber } from "lib/utils";

export default function EditProfile() {
  const route = useRouter();
  const { data: session, update } = useSession() as any;
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserProfile>({
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
  });

  useEffect(() => {
    if (session) {
      setUserInfo((prev) => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || "",
        phone: session.user?.phone || "",
        address: {
          street: session.user?.address?.street || "",
          city: session.user?.address?.city || "",
          state: session.user?.address?.state || "",
          postalCode: session.user?.address?.postalCode || "",
          country: session.user?.address?.country || "",
        },
      }));
    }
  }, [session?.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in userInfo.address) {
      setUserInfo((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setUserInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const formattedPhoneNumber = new AsYouType().input(e.target.value);
    setUserInfo((prev) => ({ ...prev, phone: formattedPhoneNumber }));
  };

  const validateInput = () => {
    if (!userInfo.email || !isValidEmail(userInfo.email)) {
      toast.error("Please enter a valid email.");
      return false;
    }
    if (!userInfo.name || userInfo.name.trim().length === 0) {
      toast.error("Please enter your name.");
      return false;
    }

    if (userInfo.phone && !isValidPhoneNumber(userInfo.phone)) {
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
          user: userInfo,
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
      <div className="w-full max-w-md rounded-lg border bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            placeholder="Jane Doe"
            label="* Your name:"
            name="name"
            type="text"
            id="name"
            value={userInfo.name}
            onChange={handleChange}
          />
          <InputField
            placeholder="jane@example.com"
            label="* Email address:"
            name="email"
            type="email"
            id="email"
            value={userInfo.email}
            onChange={handleChange}
          />
          <InputField
            placeholder="+1 234 567 8910"
            label="Phone number:"
            name="phone"
            type="tel"
            id="phone"
            value={userInfo.phone}
            onChange={handlePhoneChange}
          />
          <AddressInput address={userInfo.address} setAddress={handleChange} />
          <Button type="submit">
            {" "}
            {isLoading && <ColorWheelIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Processing" : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
