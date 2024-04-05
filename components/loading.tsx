import { StarIcon } from "@radix-ui/react-icons";

type LoadingProps = {
  message?: string;
};

export default function Loading({ message }: LoadingProps) {
  const messageParts = message?.split("\n");
  return (
    // negative margin to account for header
    <div className="-mt-32 flex h-screen grow flex-col items-center justify-center space-y-5">
      {messageParts && (
        <div>
          {messageParts.map((part, index) => (
            // Rendering each part of loading message as a separate line
            <p key={index}>{part}</p>
          ))}
        </div>
      )}
      <StarIcon className="h-10 w-10 animate-spin text-foreground" />
    </div>
  );
}
