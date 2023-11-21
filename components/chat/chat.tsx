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
import { ArchetypeValues } from "app/report/components/report";

const IS_PREVIEW = process.env.VERCEL_ENV === "preview";
export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>("ai-token", null);
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? "");
  const [scores, setScores] = useState<ArchetypeValues | undefined>();
  const session = useSession() as any;
  const { messages, append, reload, stop, isLoading, input, setInput } = useChat({
    initialMessages,
    body: {
      id,
      scores,
      userId: session.data?.user.id,
      previewToken,
    },
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText);
      }
    },
  });

  useEffect(() => {
    // Scroll to the bottom of the page
    window.scrollTo(0, document.documentElement.scrollHeight);
  }, [messages]);

  useEffect(() => {
    async function fetchScores() {
      const response = await fetch(`/api/quiz/?userId=${session.data?.user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch scores.");
      }
      const scoresData = (await response.json()) as any;
      setScores(scoresData.scores);
    }

    if (!scores && session?.data?.user) {
      fetchScores().catch((error) => {
        toast.error(`Error fetching scores: ${error.message}`);
      });
    }
  }, [session?.data?.user, scores]);

  return (
    <>
      <div className={cn("pb-[150px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
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