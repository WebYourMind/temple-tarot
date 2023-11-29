import { type SyntheticEvent, type ReactNode } from "react";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import Message from "components/ui/message";

interface AuthFormProps {
  isLoading: boolean;
  onSubmit: (event: SyntheticEvent) => Promise<void>;
  children: ReactNode;
  responseMessage?: {
    message: string;
    error: boolean;
  };
}

export default function AuthForm({ isLoading, onSubmit, children, responseMessage }: AuthFormProps) {
  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} method="POST">
        <div className="grid gap-4">
          {children}
          {responseMessage?.message && <Message error={true}>{responseMessage?.message}</Message>}
          <Button disabled={isLoading}>
            {isLoading && <ColorWheelIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Processing" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
