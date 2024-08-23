import { useState } from "react";
import { Button } from "components/ui/button";
import { track } from "@vercel/analytics/react";
import toast from "react-hot-toast";
import { Textarea } from "components/ui/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { Profile } from "next-auth";

const FeedbackButtons = ({ content }) => {
  const { data: session } = useSession();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  const handleSubmitAdditionalFeedback = async () => {
    const { id, email, name } = session.user as Profile & { id: string };

    track("feedback", {
      feedbackMessage,
      content,
      userId: id,
      email,
      name,
    });
    toast.success("Feedback submitted. Thank you!");
    setIsFeedbackSubmitted(true);
  };

  return (
    <div className="flex w-full flex-col items-center space-y-6 font-sans text-sm fade-in">
      <Textarea
        rows={4}
        placeholder="Your feedback is valuable to us; please share any suggestions or experiences to help us improve future updates."
        className="inline-block w-full"
        value={feedbackMessage}
        onChange={(e) => setFeedbackMessage(e.target.value)}
      />
      <Button
        onClick={handleSubmitAdditionalFeedback}
        disabled={isFeedbackSubmitted || !feedbackMessage}
        className="w-full"
      >
        Send Feedback <PaperPlaneIcon className="ml-2" />
      </Button>
    </div>
  );
};

export default FeedbackButtons;
