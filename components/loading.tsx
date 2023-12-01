import { ColorWheelIcon } from "@radix-ui/react-icons";

type LoadingProps = {
  message?: string;
};

export default function Loading({ message }: LoadingProps) {
  const messageParts = message?.split("\n");
  return (
    <div className="-m-32 flex h-screen grow flex-col items-center justify-center space-y-5">
      {messageParts && (
        <div>
          {messageParts.map((part, index) => (
            // Rendering each part as a separate paragraph
            <p key={index}>{part}</p>
          ))}
        </div>
      )}
      <ColorWheelIcon className="h-10 w-10 animate-spin text-orange-600" />
    </div>
  );
}
