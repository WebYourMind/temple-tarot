import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { deckCardsMapping } from "lib/tarot-data/tarot-deck";
import { ArrowLeft, ArrowRight, Dot } from "lucide-react";
import { IconClose } from "components/ui/icons";
import { useRouter } from "next/navigation";
import FeedbackButtons from "./reading-feedback";

const TarotReadingSlides = ({ interpretation }) => {
  const { query, selectedDeck, handleReset } = useTarotSession();
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    return () => {
      handleReset();
    };
  }, []);

  function handleClose() {
    router.back();
  }

  const nextSlide = () => {
    if (currentSlide < interpretation.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  let imageUrl;

  if (selectedDeck.value === "custom") {
    // get the selected deck from reading?
    const card = deckCardsMapping[selectedDeck.value].find(
      (card) => card.cardName === interpretation[currentSlide]?.cardName
    );
    if (card && card.imageUrl) imageUrl = card.imageUrl;
  }

  return (
    <div
      className={cn(
        "relative mx-auto flex h-screen w-full max-w-2xl flex-col justify-between p-4 text-center font-sans md:max-w-3xl"
      )}
    >
      <div className="flex items-center justify-between border-b border-b-muted">
        <h1 className="my-0 text-xs">templetarot.com</h1>
        <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
          <IconClose />
        </Button>
      </div>
      <h2 className="my-0 mt-2 text-sm font-normal italic">{query || "Open Reading"}</h2>
      {/* slide content */}
      {interpretation[currentSlide] ? (
        <div className="mb-4 mt-2 flex grow flex-col justify-center border-t border-t-muted">
          {interpretation[currentSlide].title && (
            <h2 className="text-xl font-bold">{interpretation[currentSlide].title}</h2>
          )}
          {imageUrl && (
            <div className="relative flex max-h-[33vh] justify-center md:max-h-96">
              <Image
                alt={interpretation[currentSlide]?.cardName}
                src={imageUrl}
                width={256}
                height={384}
                className={cn(
                  "my-4 h-auto max-h-full w-auto max-w-full rounded-md object-contain",
                  (interpretation[currentSlide]?.orientation === "reversed" ||
                    interpretation[currentSlide]?.orientation === "Reversed") &&
                    "rotate-180"
                )}
              />
            </div>
          )}
          <p className="text-sm leading-relaxed md:text-base">{interpretation[currentSlide].content}</p>
        </div>
      ) : (
        <div className="mt-2 flex w-full grow items-center justify-center border-t border-t-muted">
          <FeedbackButtons content={JSON.stringify(interpretation)} />
        </div>
      )}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevSlide} disabled={currentSlide === 0}>
          <ArrowLeft />
        </Button>
        <div className="flex">
          {[...interpretation, {}].map((page, index) => (
            <Dot key={index.toString()} className={index === currentSlide ? "text-primary" : "text-muted"} />
          ))}
        </div>
        <Button variant="ghost" size="icon" onClick={nextSlide} disabled={currentSlide === interpretation.length}>
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default TarotReadingSlides;
