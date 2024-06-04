import React, { useState } from "react";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { useTarotSession } from "lib/contexts/tarot-session-context";

const TarotReadingSlides = ({ interpretation }) => {
  const { query, handleReset } = useTarotSession();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < interpretation.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div
      className={cn(
        "relative mx-auto flex h-full max-w-2xl grow flex-col justify-between p-4 font-sans md:pb-16 md:pt-16"
      )}
    >
      <h2>{query || "Open Reading"}</h2>
      <div className="flex grow flex-col">
        <h2 className="mb-4 text-xl font-bold">{interpretation[currentSlide].title}</h2>
        <p className="text-base leading-relaxed">{interpretation[currentSlide].content}</p>
      </div>
      <div className="mt-4 flex justify-between">
        <Button variant="ghost" onClick={prevSlide} disabled={currentSlide === 0}>
          Previous
        </Button>
        {currentSlide === interpretation.length - 1 ? (
          <Button variant="ghost" onClick={handleReset}>
            Close
          </Button>
        ) : (
          <Button variant="ghost" onClick={nextSlide} disabled={currentSlide === interpretation.length - 1}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default TarotReadingSlides;
