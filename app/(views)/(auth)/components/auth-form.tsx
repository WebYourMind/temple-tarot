import { type SyntheticEvent, type ReactNode } from "react";
import { StarIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import GoogleButton from "./google-button";

interface AuthFormProps {
  isLoading: boolean;
  onSubmit: (event: SyntheticEvent) => Promise<void | boolean | undefined>;
  isSubmitDisabled?: boolean;
  children: ReactNode;
}

const DividerWithText = () => {
  return (
    <div className="my-4 flex items-center justify-center">
      <div className="mr-3 flex-grow border-t"></div>
      <span className="text-muted">or</span>
      <div className="ml-3 flex-grow border-t"></div>
    </div>
  );
};

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
