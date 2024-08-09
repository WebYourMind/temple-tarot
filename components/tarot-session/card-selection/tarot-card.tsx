import { useState } from "react";
import Image from "next/image";
import TarotBack from "app/tarot-back.jpg";
import { cn } from "lib/utils";

export default function Card({ className = "", alt, onLoad = null, width = 200, height = 350 }) {
  const [internalLoaded, setInternalLoaded] = useState(false);

  // If onLoad is provided, use it to manage load state, else use internal state.
  const handleLoad = () => {
    if (onLoad) {
      onLoad(); // External load handling
    } else {
      setInternalLoaded(true); // Internal load handling
    }
  };

  return (
    <div
      className={cn(
        "relative transition-opacity duration-700",
        className,
        (onLoad ? true : internalLoaded) ? "opacity-100" : "opacity-0"
      )}
    >
      <Image
        className={`h-auto w-full rounded-lg object-contain md:rounded-2xl`}
        src={TarotBack}
        alt={alt || "Tarot Card"}
        width={width | 200}
        height={height | 350}
        onLoadingComplete={handleLoad} // Adjusted to handle both internal and external loading
      />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 rounded-lg border-4 border-white border-opacity-90 md:rounded-2xl md:border-8" />
    </div>
  );
}
