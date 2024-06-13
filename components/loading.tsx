import { StarIcon } from "@radix-ui/react-icons";

type LoadingProps = {
  message?: string;
};

export default function Loading({ message }: LoadingProps) {
  const messageParts = message?.split("\n");
  return (
    // negative margin to account for header
    <div className="flex h-full grow flex-col items-center justify-center space-y-5">
      <StarIcon className="animate-spin-slow h-10 w-10 text-foreground" />
      {messageParts && (
        <div>
          {messageParts.map((part, index) => (
            // Rendering each part of loading message as a separate line
            <p key={index} className="font-sans text-sm italic">
              {part}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
