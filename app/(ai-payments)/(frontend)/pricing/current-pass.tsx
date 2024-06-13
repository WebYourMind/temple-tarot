"use client";

import React, { useState, useEffect } from "react";

interface CurrentPassData {
  passExpiry: string;
}

const fetchPassExpiry = async (): Promise<CurrentPassData> => {
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

const CurrentPass: React.FC = () => {
  const [passExpiry, setPassExpiry] = useState<string>();

  useEffect(() => {
    fetchPassExpiry().then((data) => {
      if (data.passExpiry) {
        setPassExpiry(data.passExpiry);
      }
    });
  }, []);

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
      <p className="text-center text-sm">
        {isPassActive ? "You have an active Temple Tarot pass until:" : "Your last Temple Tarot pass expired on:"}
      </p>
      <p className="text-center text-sm">
        {formattedDate} at {formattedTime}
      </p>
    </div>
  );
};

export default CurrentPass;
