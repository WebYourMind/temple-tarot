import React, { memo, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "components/ui/button";
import { cn, findFullCardInDeck } from "lib/utils";
import { TarotSessionProvider, useTarotSession } from "lib/contexts/tarot-session-context";
import { ArrowLeft, ArrowRight, Dot } from "lucide-react";
import { IconClose } from "components/ui/icons";
import { useRouter } from "next/navigation";
import CardInfo from "../../app/(views)/glossary/card-info";
import { MagicFont } from "components/tarot-session/query/query-input";
import DividerWithText from "components/divider-with-text";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import ReadingFeedback from "./reading-feedback";
import InterpretationSlide from "./interpretation-slide";
import TarotSession from "./tarot-session";
import { useReadingsContext } from "lib/contexts/readings-context";
import Interpreter from "./interpreter";
import LogoComponent from "components/navigation/logo-component";
import { CardInReading, ReadingType } from "lib/types";

const TarotReadingSlides = ({ tarotSessionId = null }) => {
  const { query, selectedDeck, handleReset, aiResponse, setIsFollowUp, selectedCards } = useTarotSession();
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

  function renderCardSlide(currentSlideCards, key) {
    return (
      <div key={key} className="relative inset-0 flex h-full items-center justify-center space-x-2">
        {currentSlideCards?.length > 0 &&
          currentSlideCards.map((card: CardInReading) => {
            const cardWithImage = findFullCardInDeck(card.cardName, card.deck);
            return (
              <div
                key={card.cardName}
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className={`max-w-[${
                  100 / currentSlideCards.length
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
                      `mx-auto ${currentSlideCards.length > 1 ? "max-h-[20vh]" : ""} h-full w-auto rounded`,
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

  function addAiResponseToReading(newAiResponse: string) {
    // @ts-ignore
    setTarotSession((prevState: any) => {
      // Copy the previous readings array
      const updatedReadings = [...prevState.readings];

      // Update the last reading's aiInterpretation
      updatedReadings[updatedReadings.length - 1] = {
        ...updatedReadings[updatedReadings.length - 1], // Copy the previous reading object
        aiInterpretation: newAiResponse, // Update the aiInterpretation field
      };

      // Return the updated state
      return {
        ...prevState, // Copy the rest of the state
        readings: updatedReadings, // Update the readings array
      };
    });
  }

  function getInterpretationSlides() {
    if (tarotSession?.readings) {
      const renderInterpretationSlide = (currentReading: ReadingType, key) => {
        console.log(key);
        if (!currentReading.aiInterpretation) {
          return (
            <TarotSessionProvider
              key={key}
              isPropped
              tarotSessionId={tarotSessionId}
              addAiResponseToReading={addAiResponseToReading}
            >
              {/* @ts-ignore */}
              <Interpreter tarotSessionId={tarotSessionId} proppedTarotSession={currentReading.proppedTarotSession} />
            </TarotSessionProvider>
          );
        }
        return (
          <InterpretationSlide
            key={key}
            query={currentReading.userQuery}
            cards={currentReading.cards}
            aiResponse={currentReading.aiInterpretation}
          />
        );
      };
      return [
        ...tarotSession.readings.flatMap((currentReading, index) => {
          if (currentReading.cards && currentReading.cards.length > 0) {
            console.log(currentReading);
            const cardWithImage = findFullCardInDeck(currentReading.cards[0].cardName, currentReading.cards[0].deck);
            const readingViews = [];
            if (cardWithImage) readingViews.push((key) => renderCardSlide(currentReading.cards, key));
            readingViews.push((key) => renderInterpretationSlide(currentReading, key));
            return readingViews;
          }
          return [(key) => renderInterpretationSlide(currentReading, key)];
        }),
      ];
    }

    if (aiResponse && cards) {
      const cardWithImage = findFullCardInDeck(cards[0].cardName, cards[0].deck);
      const readingViews = [];
      if (cardWithImage) readingViews.push((key) => renderCardSlide(cards, key));
      readingViews.push((key) => <InterpretationSlide key={key} query={query} cards={cards} aiResponse={aiResponse} />);
      return readingViews;
    }
    if (aiResponse) {
      return [(key) => <InterpretationSlide key={key} query={query} cards={cards} aiResponse={aiResponse} />];
    }
    return [];
  }

  function renderFeedbackSlide(key) {
    return (
      <div key={key} className="flex h-full w-full grow flex-col items-center justify-center space-y-4 px-4">
        <Button className="w-full border-2" onClick={handleGoDeeper}>
          Go Deeper
        </Button>
        <Button className="w-full" onClick={handleNewReading}>
          New Reading
        </Button>
        <DividerWithText />
        <ReadingFeedback content={JSON.stringify(aiResponse)} />
      </div>
    );
  }

  function handleDeeperComplete(newReading: ReadingType) {
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

  function renderGoDeeperSlide(key) {
    // card selection like followupreadinginput
    return (
      <div className="h-full w-full" key={key}>
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
        <LogoComponent />
        <Button variant="ghost" size="icon" onClick={handleClose} className="-mr-3 rounded-full">
          <IconClose />
        </Button>
      </div>
      <SwipeableViews
        index={currentIndex}
        onChangeIndex={setCurrentIndex}
        className="h-full flex-col"
        slideClassName="h-full"
      >
        {slides.map((renderSlide, index) => renderSlide(index.toString()))}
      </SwipeableViews>
      <CardInfo
        card={focusedCard?.detail && focusedCard}
        open={open && focusedCard?.detail}
        onOpenChange={() => setOpen(!open)}
      />
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
