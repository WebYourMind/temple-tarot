// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from "ai";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "lib/utils";
// import { CodeBlock } from "components/ui/codeblock";
import { MemoizedReactMarkdown } from "components/chat/markdown";
import { IconOpenAI, IconUser } from "components/ui/icons";
import { ChatMessageActions } from "components/chat/chat-message-actions";
import Image from "next/image";
import Ibis from "../../app/ibis.webp";

export interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div className={cn("group relative mb-4 flex items-start md:-ml-12")} {...props}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-3xl border shadow",
          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-background text-orange-500"
        )}
      >
        {message.role === "user" ? (
          <IconUser />
        ) : (
          <Image className="rounded-3xl" src={Ibis} alt="Ibis" width={45} height={45} />
        )}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            // code({ inline, className, children, ...props }: any) {
            //   if (children.length) {
            //     if (children[0] === "▍") {
            //       return <span className="mt-1 animate-pulse cursor-default">▍</span>;
            //     }

            //     children[0] = (children[0] as string).replace("`▍`", "▍");
            //   }

            //   const match = /language-(\w+)/.exec(className || "");

            //   if (inline) {
            //     return (
            //       <code className={className} {...props}>
            //         {children}
            //       </code>
            //     );
            //   }

            //   return (
            //     <CodeBlock
            //       key={Math.random()}
            //       language={(match && match[1]) || ""}
            //       value={String(children).replace(/\n$/, "")}
            //       {...props}
            //     />
            //   );
            // },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}
