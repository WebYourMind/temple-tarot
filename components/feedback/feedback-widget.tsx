"use client";

import InputField from "app/(auth)/components/input-field";
import { Button } from "components/ui/button";
import { EmojiMeh, EmojiNice, EmojiSad, IconClose, IconMessage } from "components/ui/icons";
import { ApiResponse } from "lib/types";
import React, { useState } from "react";
import toast from "react-hot-toast";

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sentiment, setSentiment] = useState("");

  const submitFeedback = async () => {
    const feedbackData = { email, feedback, sentiment };

    try {
      const response = await fetch("/api/user-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      const data = (await response.json()) as ApiResponse;

      if (response.ok) {
        // Handle successful feedback submission
        setFeedback(""); // Clear feedback field after sending
        setSentiment(""); // Reset sentiment after sending
        setIsOpen(false); // Close widget after submitting
        toast.success(data.message);
      } else {
        // Handle errors
        console.error("Feedback submission failed:", data.message);
        toast.error("Feedback submission failed");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      //   toast.error(error as string);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 hidden md:block">
      {isOpen && (
        <div className="my-2 flex w-80 flex-col items-center space-y-4 rounded-xl border bg-background px-4 py-8 shadow-lg">
          <p>Have Feedback? We&apos;d love to hear it.</p>
          <InputField
            id="email"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className="h-40 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:h-28"
            rows={4}
            placeholder="Enter your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <div className="flex w-48 justify-around">
            <Button variant={"ghost"} className="rounded-full" onClick={() => setSentiment("negative")}>
              <EmojiSad className={sentiment === "negative" ? "text-primary" : "text-gray-400"} />
            </Button>
            <Button variant={"ghost"} className="rounded-full" onClick={() => setSentiment("neutral")}>
              <EmojiMeh className={sentiment === "neutral" ? "text-primary" : "text-gray-400"} />
            </Button>
            <Button variant={"ghost"} className="rounded-full" onClick={() => setSentiment("positive")}>
              <EmojiNice className={sentiment === "positive" ? "text-primary" : "text-gray-400"} />
            </Button>
          </div>
          <Button onClick={submitFeedback}>Submit</Button>
        </div>
      )}
      <Button className="float-right h-14 w-14 rounded-full" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <IconClose className="h-10 w-10" /> : <IconMessage className="h-10 w-10" />}
      </Button>
    </div>
  );
};

export default FeedbackWidget;