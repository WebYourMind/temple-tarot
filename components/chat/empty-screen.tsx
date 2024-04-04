import { UseChatHelpers } from "ai/react";
import appConfig from "app.config";

import { Button } from "components/ui/button";
import { IconArrowRight } from "components/ui/icons";
import { Score } from "lib/quiz";
import { useRouter } from "next/navigation";

const exampleMessages = [
  {
    heading: "What does the day have in store for me?",
    message: `What does the day have in store for me?`,
  },
  {
    heading: "Where might I find fulfilment?",
    message: "Where might I find fulfilment?",
  },
  {
    heading: "What should I pay attention to in my relationships?",
    message: "What should I pay attention to in my relationships?",
  },
  {
    heading: "Am I on the right path?",
    message: "Am I on the right path?",
  },
];

export function EmptyScreen({ setInput, scores }: Pick<UseChatHelpers, "setInput"> & { scores?: Score }) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Welcome to {appConfig.appName}</h1>
        <p className="mb-2 leading-normal">
          We&apos;re grateful to have you join us. You&apos;re now a welcome part of a community that embraces the grand
          and mysterious journey we all embark on.
        </p>
        <p className="mb-2 leading-normal">As Ram Dass said, we&apos;re all just walking each other home.</p>
        <p className="leading-normal">Are you ready to take the first step? Here are some questions you can ask:</p>
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
