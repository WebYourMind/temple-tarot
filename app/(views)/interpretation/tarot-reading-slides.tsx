import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { deckCardsMapping } from "lib/tarot-data/tarot-deck";
import { ArrowLeft, ArrowRight, Dot } from "lucide-react";
import { IconClose, IconEdit } from "components/ui/icons";
import { useRouter } from "next/navigation";
import ReadingFeedback from "./reading-feedback";
import { EnterFullScreenIcon } from "@radix-ui/react-icons";
import CardInfo from "../glossary/card-info";
import { FollowUpReadingInput, MagicFont } from "../home/query/query-input";
import { Dialog } from "components/ui/dialog";
import InfoDialog from "components/info-dialog";
import DividerWithText from "components/divider-with-text";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import Markdown from "react-markdown";

const TarotReadingSlides = ({ cards }) => {
  const {
    query,
    selectedDeck,
    handleReset,
    showInfo,
    setShowInfo,
    infoContent,
    interpretationString,
    interpretationArray,
  } = useTarotSession();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [goDeeper, setGoDeeper] = useState(false);
  const [focusedCard, setFocusedCard] = useState(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      handleReset();
    };
  }, []);

  function handleClose() {
    router.back();
  }

  function handleNewReading() {
    // router.back();
    router.push("/");
  }

  // let cards = [];

  // if (selectedDeck.value === "custom") {
  //   // get the selected deck from reading?
  //   interpretation.forEach((slide) => {
  //     if (slide.cardName) {
  //       cards.push({
  //         ...deckCardsMapping[selectedDeck.value].find((card) => card.cardName === slide.cardName),
  //         orientation: slide.orientation,
  //       });
  //     }
  //   });
  // }

  function renderCardSlide() {
    return (
      <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center space-x-2">
        {cards.length > 0 &&
          cards.map((card) => {
            let cardWithImage;
            if (selectedDeck.value === "custom") {
              cardWithImage = deckCardsMapping[selectedDeck.value].find(
                (fullCard) => fullCard.cardName === card.cardName
              );
            }
            return (
              <div
                key={card.cardName}
                className={`max-w-[${100 / cards.length}%] flex h-full flex-col items-center py-4 text-center`}
              >
                <div className="mb-2 w-full">
                  <p className="my-0">{card.cardName}</p>
                  <p className="my-0">({card.orientation})</p>
                </div>
                {cardWithImage?.imageUrl && (
                  <Image
                    onClick={() => {
                      setFocusedCard(cardWithImage);
                      setOpen(true);
                    }}
                    key={cardWithImage.cardName}
                    alt={cardWithImage.cardName}
                    src={cardWithImage.imageUrl}
                    width={256}
                    height={384}
                    className={cn(
                      `mx-auto ${cards.length > 1 ? "max-h-[20vh]" : "h-full"} w-auto rounded-lg`,
                      (card.orientation === "reversed" || card.orientation === "Reversed") && "rotate-180"
                    )}
                  />
                )}
              </div>
            );
          })}
      </div>
    );
  }

  function getInterpretationSlides() {
    if (interpretationArray) {
      return [
        ...interpretationArray.map((currentSlide, index) => {
          const SlideComponent = () => (
            <div className="my-1 flex grow flex-col justify-center">
              <Markdown className="text-start text-sm leading-relaxed tracking-wide md:text-base">
                {currentSlide.content}
              </Markdown>
            </div>
          );

          SlideComponent.displayName = `SlideComponent_${index}`;
          return SlideComponent;
        }),
      ];
    }
    if (interpretationString) {
      return [
        () => (
          <div className="flex h-full w-full flex-col text-center">
            <div className="absolute bottom-0 top-0 w-full overflow-scroll py-4">
              <div className="flex space-x-4">
                {cards.length > 0 &&
                  cards.map((card) => {
                    let cardWithImage;
                    if (selectedDeck.value === "custom") {
                      cardWithImage = deckCardsMapping[selectedDeck.value].find(
                        (fullCard) => fullCard.cardName === card.cardName
                      );
                    }
                    return (
                      <div className="my-4" key="interpretationString">
                        {cardWithImage?.imageUrl && (
                          <Image
                            onClick={() => {
                              setFocusedCard(cardWithImage);
                              setOpen(true);
                            }}
                            key={cardWithImage.cardName}
                            alt={cardWithImage.cardName}
                            src={cardWithImage.imageUrl}
                            width={256}
                            height={384}
                            className={cn(
                              `mx-auto ${cards.length > 1 ? "max-h-[20vh]" : "max-h-24"} w-auto rounded-lg`,
                              (card.orientation === "reversed" || card.orientation === "Reversed") && "rotate-180"
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
              <Markdown className="prose prose-indigo text-start font-sans text-base leading-relaxed tracking-wide">
                {interpretationString}
              </Markdown>
            </div>
            {/* <CardInfo card={card} open={open} onOpenChange={() => setOpen(!open)} /> */}
          </div>
        ),
      ];
    }
    return [];
  }

  function renderFeedbackSlide() {
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center space-y-4 px-4">
        <Button className="w-full" onClick={handleGoDeeper} disabled>
          Go Deeper (Coming Soon)
        </Button>
        <Button className="w-full" onClick={handleNewReading}>
          New Reading
        </Button>
        <DividerWithText />
        <ReadingFeedback content={JSON.stringify(interpretationString || interpretationArray)} />
      </div>
    );
  }

  function renderGoDeeperSlide() {
    return (
      <div className="h-full w-full">
        <Dialog open={showInfo} onOpenChange={() => setShowInfo(!showInfo)}>
          <FollowUpReadingInput />
          <InfoDialog infoContent={infoContent} closeDialog={() => setShowInfo(false)} />
        </Dialog>
      </div>
    );
  }

  let slides = [];
  if (cards.length > 0) slides.push(renderCardSlide);
  slides = [...slides, ...getInterpretationSlides()];
  slides.push(renderFeedbackSlide);
  if (goDeeper) slides.push(renderGoDeeperSlide);

  const nextSlide = () => {
    if (currentIndex < slides.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  function handleGoDeeper() {
    setGoDeeper(true);
  }

  return (
    <div
      className={cn(
        "relative mx-auto flex h-full w-full max-w-2xl grow flex-col justify-between p-4 text-center font-sans fade-in md:max-w-lg",
        MagicFont.className
      )}
    >
      <div className="flex items-center justify-between">
        <h1 className="my-0 text-xs">templetarot.com</h1>
        <Button variant="ghost" size="icon" onClick={handleClose} className="-mr-3 rounded-full">
          <IconClose />
        </Button>
      </div>
      <div className="my-0 flex items-center justify-center border-b border-t border-b-muted border-t-muted py-4 text-sm font-normal italic">
        <h2 className="my-0 text-sm font-normal italic">{query || "Open Reading"}</h2>
        {/* <IconEdit className="ml-2" /> */}
      </div>
      <SwipeableViews
        index={currentIndex}
        onChangeIndex={setCurrentIndex}
        className="h-full flex-col"
        slideClassName="h-full"
      >
        {slides.map((renderSlide) => renderSlide())}
      </SwipeableViews>
      <CardInfo card={focusedCard} open={open} onOpenChange={() => setOpen(!open)} />
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevSlide} disabled={currentIndex === 0}>
          <ArrowLeft />
        </Button>
        <div className="flex">
          {slides.map((page, index) => (
            <Dot
              key={index.toString()}
              onClick={() => setCurrentIndex(index)}
              className={index === currentIndex ? "text-primary" : "text-muted"}
            />
          ))}
        </div>
        <Button variant="ghost" size="icon" onClick={nextSlide} disabled={currentIndex === slides.length}>
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default TarotReadingSlides;
