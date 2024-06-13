"use client";

import { useChat, type Message } from "ai/react";

import { cn } from "lib/utils";
import { ChatList } from "components/chat/chat-list";
import { ChatPanel } from "components/chat/chat-panel";
import { EmptyScreen } from "components/chat/empty-screen";
import { ChatScrollAnchor } from "components/chat/chat-scroll-anchor";
import { useLocalStorage } from "lib/hooks/use-local-storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Loading from "components/loading";
import { Score } from "lib/quiz";
import { useSuggestedResponses } from "lib/hooks/use-suggested-response";
import { SuggestedResponses } from "./suggested-responses";
import { useUserAccessPlan } from "app/(ai-payments)/(frontend)/contexts/user-access-plan-context";

const IS_PREVIEW = process.env.VERCEL_ENV === "preview";
export interface ChatProps extends React.ComponentProps<"div"> {
  id?: string;
}

export function Chat({ id, className }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>("ai-token", null);
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? "");
  const [scores, setScores] = useState<Score | undefined>();
  const [initLoading, setInitLoading] = useState(true);
  const [initialMessages, setInitialMessages] = useState<Message[] | undefined>();
  const { fetchUserAccessPlan } = useUserAccessPlan();
  const session = useSession() as any;
  const { messages, append, reload, stop, isLoading, input, setInput } = useChat({
    initialMessages,
    body: {
      id,
      scores,
      userId: session.data?.user.id,
      previewToken,
    },
    async onResponse(response) {
      await fetchUserAccessPlan();
      if (response.status === 401) {
        toast.error(response.statusText);
      }
    },
  });
  const { generateResponses, suggestedResponses, setSuggestedResponses } = useSuggestedResponses();
  const [lastMessage, setLastMessage] = useState<string | undefined>();

  useEffect(() => {
    // Scroll to the bottom of the page
    window.scrollTo(0, document.documentElement.scrollHeight);
  }, [messages]);

  useEffect(() => {
    if (
      messages &&
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant" &&
      messages[messages.length - 1].content !== lastMessage &&
      !isLoading
    ) {
      generateResponses(messages[messages.length - 1].content);
      setLastMessage(messages[messages.length - 1].content);
    } else if (isLoading) {
      setSuggestedResponses(null);
    }
  }, [messages, isLoading]);

  useEffect(() => {
    async function fetchData() {
      setInitLoading(true);
      try {
        const messagesResponse = fetch(`/api/chat/?userId=${session.data?.user.id}`);
        const scoresResponse = fetch(`/api/quiz/?userId=${session.data?.user.id}`);

        const [messagesRes, scoresRes] = await Promise.all([messagesResponse, scoresResponse]);

        if (!messagesRes.ok && messagesRes.status !== 404) {
          throw new Error("Failed to fetch messages.");
        }

        const chatData = (await messagesRes.json()) as any;
        setInitialMessages(chatData.existingMessages);

        if (!scoresRes.ok && scoresRes.status !== 404) {
          throw new Error("Failed to fetch scores.");
        }

        const scoresData = (await scoresRes.json()) as any;
        setScores(scoresData.scores);

        setInitLoading(false);
      } catch (error: any) {
        toast.error(`Error: ${error.message}`);
        setInitLoading(false);
      }
    }

    if (session?.data?.user) {
      fetchData();
    }
  }, [session?.data?.user.id]);

  if (initLoading) {
    return <Loading message="Getting chat messages..." />;
  }

  return (
    <>
      <div className={cn("pb-[150px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
            {suggestedResponses && suggestedResponses?.length > 0 && !isLoading && (
              <SuggestedResponses
                suggestedResponses={suggestedResponses}
                setSuggestedResponses={setSuggestedResponses}
                append={append}
                id={id}
                isLoading={isLoading}
              />
            )}
          </>
        ) : (
          <EmptyScreen setInput={setInput} scores={scores} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{" "}
              <a href="https://platform.openai.com/signup/" className="underline">
                signing up
              </a>{" "}
              on the OpenAI website. This is only necessary for preview environments so that the open source community
              can test the app. The token will be saved to your browser&apos;s local storage under the name{" "}
              <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={(e) => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput);
                setPreviewTokenDialog(false);
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
