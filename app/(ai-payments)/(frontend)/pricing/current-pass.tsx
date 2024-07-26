"use client";

import React from "react";
import { useUserAccessPlan } from "../contexts/user-access-plan-context";

const CurrentPass: React.FC = () => {
  const { isSubscribed, passExpiry } = useUserAccessPlan();

  if (isSubscribed) {
    return (
      <div className="mx-auto mb-8 max-w-sm rounded-lg border p-2">
        <p className="text-center text-base md:text-base">You have an active Temple Tarot subscription ✨</p>
      </div>
    );
  }

  if (!passExpiry) return null;

  const isPassActive = new Date(passExpiry) > new Date();

  const options = { month: "long", day: "numeric", year: "numeric" };
  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
  // @ts-expect-error
  const formattedDate = passExpiry && new Date(passExpiry).toLocaleDateString("en-US", options);
  // @ts-expect-error
  const formattedTime = passExpiry && new Date(passExpiry).toLocaleTimeString("en-US", timeOptions);

  return (
    <div className="mx-auto mb-8 max-w-sm rounded-lg border p-2">
      <p className="text-center text-base md:text-base">
        {isPassActive ? "You have an active Temple Tarot pass until:" : "Your last Temple Tarot pass expired on:"}
      </p>
      <p className="text-center text-sm md:text-base">
        {formattedDate} at {formattedTime}
      </p>
    </div>
  );
};

export default CurrentPass;
