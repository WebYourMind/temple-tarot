import { UseChatHelpers } from "ai/react";

import { Button } from "components/ui/button";
import { IconArrowRight } from "components/ui/icons";
import { Score } from "lib/quiz";
import { useRouter } from "next/navigation";

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

export function EmptyScreen({ setInput, scores }: Pick<UseChatHelpers, "setInput"> & { scores?: Score }) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Welcome to Merlin AI!</h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          We&apos;re excited to have you join us. You&apos;re now part of a community that&apos;s all about
          understanding and leveraging your unique thinking style.
        </p>
        {scores ? (
          <>
            <p className="mb-2 leading-normal text-muted-foreground">
              Ready to begin? Take the Thinking Style Quiz to enhance your interactions with our chatbot, Merlin and
              learn valuable insights.
            </p>
            <Button variant="link" className="h-auto p-0 text-base" onClick={() => router.push("/quiz")}>
              <IconArrowRight className="mr-2 text-muted-foreground" />
              Take the quiz
            </Button>
          </>
        ) : (
          <>
            <p className="leading-normal text-muted-foreground">
              Merlin is aware of your thinking style! You can start a conversation here or try the following examples:
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
          </>
        )}
      </div>
    </div>
  );
}
