import { useState } from "react";
import { Button } from "components/ui/button";
// import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { track } from "@vercel/analytics/react";
import toast from "react-hot-toast";
import { Textarea } from "components/ui/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { Profile } from "next-auth";
// import { cn } from "lib/utils";

const FeedbackButtons = ({ content }) => {
  const { data: session } = useSession();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  // const [resonance, setResonance] = useState(null);
  // const [aiQuality, setAiQuality] = useState(null);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  const handleSubmitAdditionalFeedback = async () => {
    const { id, email, name } = session.user as Profile & { id: string };

    track("feedback", {
      feedbackMessage,
      // resonance,
      // aiResponse: aiQuality,
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
      {/* <div>
        <p className="text-center">Did this reading resonate with you?</p>
        <div className="flex justify-center space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setResonance("Good")}
            className={cn("rounded-full", resonance === "Good" ? "text-green-500" : "")}
            disabled={isFeedbackSubmitted}
          >
            <ThumbsUpIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setResonance("Bad")}
            className={cn("rounded-full", resonance === "Bad" ? "text-red-500" : "")}
            disabled={isFeedbackSubmitted}
          >
            <ThumbsDownIcon />
          </Button>
        </div>
      </div>
      <div>
        <p className="text-center">How was the AI response?</p>
        <div className="flex justify-center space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setAiQuality("Good")}
            className={cn("rounded-full", aiQuality === "Good" ? "text-green-500" : "")}
            disabled={isFeedbackSubmitted}
          >
            <ThumbsUpIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setAiQuality("Bad")}
            className={cn("rounded-full", aiQuality === "Bad" ? "text-red-500" : "")}
            disabled={isFeedbackSubmitted}
          >
            <ThumbsDownIcon />
          </Button>
        </div>
      </div> */}
      <Textarea
        rows={3}
        placeholder="Is there any feedback you'd like to share?"
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
