import { ReactNode, createContext, useContext, useState } from "react";

type FeedbackDataType = { type: string; subject: any };

const FeedbackContext = createContext({
  feedbackData: { type: "", subject: undefined },
  includeData: (data: FeedbackDataType) => {},
});

export function useFeedback() {
  return useContext(FeedbackContext);
}

export function FeedbackDataProvider({ children }: { children: ReactNode }) {
  const [feedbackData, setFeedbackData] = useState<FeedbackDataType>({ type: "", subject: undefined });

  const includeData = (data: FeedbackDataType) => {
    setFeedbackData(data);
  };

  return <FeedbackContext.Provider value={{ feedbackData, includeData }}>{children}</FeedbackContext.Provider>;
}
