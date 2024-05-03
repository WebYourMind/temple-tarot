"use client";
import Loading from "components/loading";
import { Button } from "components/ui/button";
// components/SubscriptionManager.js
import React, { useState, useEffect } from "react";

const SubscriptionManager = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/subscription")
      .then((res) => res.json())
      .then((data: { isSubscribed: boolean }) => {
        setSubscription(data.isSubscribed);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch subscription data.");
        setLoading(false);
      });
  }, []);

  const cancelSubscription = () => {
    fetch("/api/cancel-subscription", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        alert("Subscription cancelled successfully!");
        setSubscription(null); // Update UI to reflect cancellation
      })
      .catch((err) => {
        setError("Failed to cancel subscription.");
      });
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container max-w-2xl p-4 py-8">
      {subscription ? (
        <>
          <h3 className="text-lg font-semibold">Your Subscription Status</h3>
          <p>Subscribed</p>
          <Button variant="destructive" onClick={cancelSubscription}>
            Cancel Subscription
          </Button>
        </>
      ) : (
        <p>You are not currently subscribed.</p>
      )}
    </div>
  );
};

export default SubscriptionManager;
