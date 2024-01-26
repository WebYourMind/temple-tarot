"use client";

import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { Button } from "components/ui/button";
import { Dispatch, SetStateAction } from "react";

interface Props {
  suggestedResponses: string[];
  setSuggestedResponses: Dispatch<SetStateAction<string[] | null | undefined>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => Promise<string | null | undefined>;
  id?: string;
  isLoading: boolean;
}

export function SuggestedResponses({ suggestedResponses, setSuggestedResponses, append, id }: Props) {
  return (
    <div className="relative mx-auto max-w-2xl space-y-4 px-4 animate-in fade-in-0">
      <hr></hr>
      <p>Suggested responses:</p>
      {suggestedResponses.map((response) => {
        return (
          <Button
            key={response}
            variant={"outline"}
            className="h-full text-left"
            onClick={async () => {
              setSuggestedResponses(null);
              await append({
                id,
                content: response,
                role: "user",
              });
            }}
          >
            {response}
          </Button>
        );
      })}
    </div>
  );
}
