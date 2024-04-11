import Image from "next/image";
import TarotBack from "../../../tarot-back.jpg";
import { cn } from "lib/utils";

interface CardProps {
  className?: string;
  alt?: string;
}

export default function Card({ className = "", alt }: CardProps) {
  return (
    <Image
      className={cn("rounded-lg border-8 border-yellow-50 shadow-md", className)}
      src={TarotBack}
      alt={alt || "Tarot Card"}
      width={200}
      height={350}
    />
  );
}
