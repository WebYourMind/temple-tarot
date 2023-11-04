import { type SyntheticEvent, type ReactNode } from "react";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import Message from "components/ui/message";

interface AuthFormProps {
  isLoading: boolean;
  onSubmit: (event: SyntheticEvent) => Promise<void>;
  children: ReactNode;
  error?: string | null;
}

export default function AuthForm({ isLoading, onSubmit, children, error }: AuthFormProps) {
  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} method="POST">
        <div className="grid gap-2">
          {children}
          {error && <Message error={true}>{error}</Message>}
          <Button disabled={isLoading}>
            {isLoading && <ColorWheelIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Processing" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
