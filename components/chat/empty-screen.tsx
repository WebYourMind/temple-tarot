import { UseChatHelpers } from "ai/react";

import { Button } from "components/ui/button";
import { IconArrowRight } from "components/ui/icons";

const exampleMessages = [
  {
    heading: "Explain thinking styles",
    message: `What are thinking styles?`,
  },
  {
    heading: "Create a community",
    message: "How can I create a community around the topic of ",
  },
  {
    heading: "Change your perspective",
    message: "How can I change my perspective of ",
  },
];

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, "setInput">) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Welcome to Merlin AI!</h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an AI chatbot built on the principles of Shift Thinking.
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
