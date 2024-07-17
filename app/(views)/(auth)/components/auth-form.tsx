import { type SyntheticEvent, type ReactNode } from "react";
import { StarIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import GoogleButton from "./google-button";
import DividerWithText from "components/divider-with-text";

interface AuthFormProps {
  isLoading: boolean;
  onSubmit: (event: SyntheticEvent) => Promise<void | boolean | undefined>;
  isSubmitDisabled?: boolean;
  children: ReactNode;
}

export default function AuthForm({ isLoading, onSubmit, isSubmitDisabled, children }: AuthFormProps) {
  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} method="POST">
        <div className="grid gap-4">
          {children}
          <Button className="mt-4" disabled={isLoading || isSubmitDisabled}>
            {isLoading && <StarIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Processing" : "Submit"}
          </Button>
          <DividerWithText />
          <GoogleButton />
        </div>
      </form>
    </div>
  );
}
