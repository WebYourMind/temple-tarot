import React, { memo, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { TarotSessionProvider, useTarotSession } from "lib/contexts/tarot-session-context";
import { deckCardsMapping } from "lib/tarot-data/tarot-deck";
import { ArrowLeft, ArrowRight, Dot } from "lucide-react";
import { IconClose } from "components/ui/icons";
import { useRouter } from "next/navigation";
import { EnterFullScreenIcon } from "@radix-ui/react-icons";
import CardInfo from "../../app/(views)/glossary/card-info";
import { MagicFont } from "components/tarot-session/query/query-input";
import DividerWithText from "components/divider-with-text";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import Markdown from "react-markdown";
import ReadingFeedback from "app/(views)/interpretation/reading-feedback";
import InterpretationSlide from "./interpretation-slide";
import TarotSession from "./tarot-session";
import { useReadingsContext } from "lib/contexts/readings-context";
import { Reading } from "lib/database/readings.database";
import { CardInReading } from "lib/database/cardsInReadings.database";
import Interpreter from "./interpreter";
import LogoComponent from "components/navigation/logo-component";

const TarotReadingSlides = ({ tarotSessionId = null }) => {
  const { query, selectedDeck, handleReset, interpretationArray, aiResponse, setIsFollowUp, selectedCards } =
    useTarotSession();
  const { tarotSession, setTarotSession } = useReadingsContext();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [goDeeper, setGoDeeper] = useState(false);
  const [focusedCard, setFocusedCard] = useState(null);
  const router = useRouter();

  const cards = selectedCards || tarotSession?.readings[0]?.cards;

  useEffect(() => {
    return () => {
      setTarotSession(null);
      handleReset();
    };
  }, []);

  function handleClose() {
    router.back();
  }

  function handleNewReading() {
    router.push("/");
  }

  function renderCardSlide(currentSlideCards) {
    return (
      <div key={"cardslide"} className="relative inset-0 flex h-full items-center justify-center space-x-2">
        {currentSlideCards?.length > 0 &&
          currentSlideCards.map((card: CardInReading) => {
            let cardWithImage;
            if (selectedDeck.value === "custom") {
              cardWithImage = deckCardsMapping[selectedDeck.value].find(
                (fullCard) => fullCard.cardName === card.cardName
              );
            }
            return (
              <div
                key={card.cardName}
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className={`max-w-[${
                  100 / cards.length
                }%] flex h-full w-full flex-col items-center justify-center p-2 text-center`}
              >
                <div className={cn("mb-2 w-full", MagicFont.className)}>
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
                      `mx-auto ${cards.length > 1 ? "max-h-[20vh]" : ""} h-full w-auto rounded-lg`,
                      card.orientation.toLowerCase() === "reversed" && "rotate-180"
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
    if (tarotSession?.readings) {
      const renderInterpretationSlide = (currentReading: Reading) => {
        if (!currentReading.aiInterpretation) {
          return (
            <TarotSessionProvider isPropped tarotSessionId={tarotSessionId}>
              {/* @ts-ignore */}
              <Interpreter tarotSessionId={tarotSessionId} proppedTarotSession={currentReading.proppedTarotSession} />
            </TarotSessionProvider>
          );
        }
        return (
          <InterpretationSlide
            query={currentReading.userQuery}
            cards={currentReading.cards}
            selectedDeck={selectedDeck}
            aiResponse={currentReading.aiInterpretation}
          />
        );
      };
      return [
        ...tarotSession.readings.flatMap((currentReading, index) => {
          if (currentReading.cards && currentReading.cards.length > 0) {
            return [() => renderCardSlide(currentReading.cards), () => renderInterpretationSlide(currentReading)];
          }
          return [() => renderInterpretationSlide(currentReading)];
        }),
      ];
    }

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
    if (aiResponse && cards) {
      return [
        () => renderCardSlide(cards),
        () => <InterpretationSlide query={query} cards={cards} selectedDeck={selectedDeck} aiResponse={aiResponse} />,
      ];
    }
    if (aiResponse) {
      return [
        () => <InterpretationSlide query={query} cards={cards} selectedDeck={selectedDeck} aiResponse={aiResponse} />,
      ];
    }
    return [];
  }

  function renderFeedbackSlide() {
    return (
      <div key={"feedback"} className="flex h-full w-full grow flex-col items-center justify-center space-y-4 px-4">
        <Button className="w-full border-2 font-bold" onClick={handleGoDeeper}>
          Go Deeper
        </Button>
        <Button className="w-full" onClick={handleNewReading}>
          New Reading
        </Button>
        <DividerWithText />
        <ReadingFeedback content={JSON.stringify(aiResponse || interpretationArray)} />
      </div>
    );
  }

  function handleDeeperComplete(newReading: Reading) {
    if (tarotSession) {
      setTarotSession({ ...tarotSession, readings: [...tarotSession?.readings, newReading] });
    } else {
      setTarotSession({
        ...tarotSession,
        readings: [
          {
            aiInterpretation: aiResponse,
            cards: selectedCards,
            userQuery: query,
          },
          newReading,
        ],
      });
    }
    setGoDeeper(false);
  }

  function renderGoDeeperSlide() {
    // card selection like followupreadinginput
    return (
      <div className="h-full w-full" key={"godeeper"}>
        <TarotSessionProvider
          followUpContext={
            tarotSession || {
              id: tarotSessionId,
              userId: "",
              createdAt: new Date(),
              readings: [
                {
                  aiInterpretation: aiResponse,
                  cards: selectedCards,
                  userQuery: query,
                },
              ],
            }
          }
          isFollowUp
          tarotSessionId={tarotSessionId}
          onResponseComplete={handleDeeperComplete}
        >
          <TarotSession />
        </TarotSessionProvider>
      </div>
    );
  }

  let slides = [...getInterpretationSlides(), goDeeper ? renderGoDeeperSlide : renderFeedbackSlide];

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
        "relative mx-auto flex h-full w-full max-w-2xl grow flex-col justify-between text-center font-sans fade-in md:max-w-2xl",
        MagicFont.className
      )}
    >
      <div className="flex items-center justify-between p-4">
        {/* <h1 className="my-0 text-xs">Temple Tarot</h1> */}
        <LogoComponent />
        <Button variant="ghost" size="icon" onClick={handleClose} className="-mr-3 rounded-full">
          <IconClose />
        </Button>
      </div>
      {/* <div className="my-0 flex items-center justify-center border-y border-y-muted py-4 text-sm font-normal italic">
        <h2 className="my-0 text-sm font-normal italic">{query || "Open Reading"}</h2>
      </div> */}
      <SwipeableViews
        index={currentIndex}
        onChangeIndex={setCurrentIndex}
        className="h-full flex-col"
        slideClassName="h-full"
      >
        {slides.map((renderSlide) => renderSlide())}
      </SwipeableViews>
      <CardInfo card={focusedCard} open={open} onOpenChange={() => setOpen(!open)} />
      <div className="flex items-center justify-between p-4">
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
        <Button variant="ghost" size="icon" onClick={nextSlide} disabled={currentIndex === slides.length - 1}>
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default memo(TarotReadingSlides);
