import { cn } from "lib/utils";

type CardProps = {
  children: JSX.Element;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return <div className={cn("w-full rounded-sm", className)}>{children}</div>;
}
