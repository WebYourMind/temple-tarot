import { useState } from "react";
import { Button } from "components/ui/button";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { track } from "@vercel/analytics/react";
import toast from "react-hot-toast";
import { Textarea } from "components/ui/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { Profile } from "next-auth";

const FeedbackButtons = ({ content }) => {
  const { data: session } = useSession();
  const [feedbackGiven, setFeedbackGiven] = useState({ resonance: false, aiResponse: false });
  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  const submitFeedback = (type, value) => {
    const { id, email, name } = session.user as Profile & { id: string };
    track(type, { feedback: value, content, userId: id, email, name });
    toast.success("Feedback submitted. Thank you!"); // Notify user of successful feedback submission
    setFeedbackGiven({ ...feedbackGiven, [type]: true }); // Update state to reflect feedback given
  };

  const handleSubmitAdditionalFeedback = async () => {
    if (additionalFeedback.trim() === "") {
      toast.error("Please provide some feedback.");
      return;
    }
    const { id, email, name } = session.user as Profile & { id: string };

    track("comments", { feedback: additionalFeedback, content, userId: id, email, name });
    toast.success("Additional feedback submitted. Thank you!");
    setIsFeedbackSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center space-y-6 font-sans text-sm fade-in">
      <div>
        <p className="text-center">Did this reading resonate with you?</p>
        <div className="flex justify-center space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => submitFeedback("resonance", "yes")}
            disabled={feedbackGiven.resonance}
            className="rounded-full"
          >
            <ThumbsUpIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => submitFeedback("resonance", "no")}
            disabled={feedbackGiven.resonance}
            className="rounded-full"
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
            onClick={() => submitFeedback("aiResponse", "good")}
            disabled={feedbackGiven.aiResponse}
            className="rounded-full"
          >
            <ThumbsUpIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => submitFeedback("aiResponse", "poor")}
            disabled={feedbackGiven.aiResponse}
            className="rounded-full"
          >
            <ThumbsDownIcon />
          </Button>
        </div>
      </div>
      <Textarea
        rows={3}
        placeholder="Anything else you'd like to share?"
        className="inline-block"
        value={additionalFeedback}
        onChange={(e) => setAdditionalFeedback(e.target.value)}
      />
      <Button onClick={handleSubmitAdditionalFeedback} disabled={isFeedbackSubmitted}>
        Send Feedback <PaperPlaneIcon className="ml-2" />
      </Button>
    </div>
  );
};

export default FeedbackButtons;
