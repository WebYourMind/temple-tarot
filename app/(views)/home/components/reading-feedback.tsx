import { useState } from "react";
import { Button } from "components/ui/button";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { track } from "@vercel/analytics/react";
import toast from "react-hot-toast"; // Assuming you have react-hot-toast installed

const FeedbackButtons = ({ content }) => {
  const [feedbackGiven, setFeedbackGiven] = useState({ resonance: false, aiResponse: false });

  const submitFeedback = (type, value) => {
    track(type, { feedback: value, content });
    toast.success("Feedback submitted. Thank you!"); // Notify user of successful feedback submission
    setFeedbackGiven({ ...feedbackGiven, [type]: true }); // Update state to reflect feedback given
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
    </div>
  );
};

export default FeedbackButtons;
