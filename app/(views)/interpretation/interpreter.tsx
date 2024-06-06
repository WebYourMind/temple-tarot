"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "styles/cards.css";
import Loading from "components/loading";
import { useCredits } from "app/(ai-payments)/(frontend)/contexts/credit-context";
import { useLumens } from "lib/contexts/lumen-context";
import TarotReadingSlides from "app/(views)/interpretation/tarot-reading-slides";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { useRouter } from "next/navigation";
import { parseJsonSafe } from "lib/utils";

export const tarotFont = { className: "font-sans" }; // Baskervville({ weight: ["400"], subsets: ["latin"] });

function Interpreter() {
  const {
    query,
    selectedCards: cards,
    spreadType: spread,
    interpretationArray,
    setInterpretationArray,
    selectedDeck,
    setPhase,
  } = useTarotSession();

  const router = useRouter();

  const { fetchCreditBalance } = useCredits();
  const { fetchLumenBalance } = useLumens();
  // const [reading, setReading] = useState({
  //   userQuery: query,
  //   createdAt: new Date().toISOString(),
  //   cards,
  //   spread,
  //   spreadType: spread.name,
  //   aiInterpretation: "",
  // });
  const [isComplete, setIsComplete] = useState(false);

  const generateReading = useCallback(async (content) => {
    let isSubscribed = true;
    const controller = new AbortController();
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, cards, userQuery: query, spread, spreadType: spread.value }),
        signal: controller.signal,
      });

      if (!response.body) throw new Error("Failed to get the stream.");

      const reader = response.body.getReader();

      let receivedLength = 0;
      let chunks = [];
      let interpretationValue = "";
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsComplete(true);
          if (interpretationValue) {
            const intArray = parseJsonSafe(interpretationValue);
            if (Array.isArray(intArray)) {
              setInterpretationArray(intArray);
            }
          }
          fetchCreditBalance();
          fetchLumenBalance();
          break;
        }

        chunks.push(value);
        receivedLength += value.length;

        const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
        if (isSubscribed) {
          interpretationValue += chunk;
          // setReading((prevReading) => ({ ...prevReading, aiInterpretation: prevReading.aiInterpretation + chunk }));
        }
      }
    } catch (error: any) {
      if (isSubscribed) {
        console.error("Error generating reading: " + error.message);
        toast.error("Oops! Something went wrong. Please try again. ");
      }
    }

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setPhase("question");
    if (cards) {
      const cardDescriptions = cards
        .map(
          (card, index) =>
            `Position: ${index + 1}, position meaning: ${spread.cardMeanings[index]} \nCard drawn for this position: "${
              card.cardName
            }" (${card.orientation}) ${
              selectedDeck.value === "custom" &&
              `\nCard definition: ${card.readingTips} Upright guidance: ${card.uprightGuidance} Reversed guidance: ${card.reversedGuidance}`
            }\n\n`
        )
        .join(", ");

      let content = "";
      if (query) {
        content += `User's query: ${query}\n\n`;
      }
      content += `Selected Tarot Deck: ${selectedDeck.promptName}\n\n`;
      content += `Chosen spread: ${spread.name}\n\nCards drawn with their positions in the spread: ${cardDescriptions}`;

      if (!interpretationArray) {
        generateReading(content);
      }
    } else {
      router.replace("/");
    }
  }, [query, cards, spread]);

  if (interpretationArray) {
    return <TarotReadingSlides interpretation={interpretationArray} />;
  }

  // if (reading.aiInterpretation && isComplete) {
  //   return (
  //     <div className={cn("mx-auto max-w-2xl md:pb-16 md:pt-16", tarotFont.className)}>
  //       <div className="flex flex-col space-y-4 py-6 fade-in md:text-sm">
  //         <div className="opacity-70">
  //           <p>{new Date(reading.createdAt).toLocaleDateString()}</p>
  //         </div>
  //         <div className="italic">
  //           <p>{reading?.userQuery || "Open Reading"}</p>
  //         </div>
  //         {reading.cards.map(
  //           (card) =>
  //             card.imageUrl && (
  //               <Image
  //                 alt={card?.cardName}
  //                 src={card?.imageUrl}
  //                 width={256}
  //                 height={384}
  //                 className="rounded-lg shadow-lg"
  //               />
  //             )
  //         )}
  //         <div>
  //           <h3 className="text-sm font-bold">Cards:</h3>
  //           {reading.cards.map((card, index) => (
  //             <p key={card.cardName} className="mb-1">
  //               {index + 1}. {card.cardName} ({card.orientation.charAt(0).toUpperCase() + card.orientation.slice(1)})
  //             </p>
  //           ))}
  //         </div>
  //       </div>
  //       <div
  //         className={cn(
  //           "fade-in-text prose prose-indigo mx-auto mb-20 w-full max-w-full py-6 leading-relaxed text-foreground md:prose-lg md:text-lg",
  //           tarotFont.className
  //         )}
  //       >
  //         {/* formatted like a letter */}
  //         {/* {reading.aiInterpretation.split(" ").map((word, index) => (
  //           <span key={index} className="whitespace-pre-wrap" style={{ opacity: 0 }}>
  //             {word}{" "}
  //           </span>
  //         ))} */}
  //         {interpretationArray && <TarotReadingSlides interpretation={interpretationArray} />}
  //       </div>
  //       {isComplete && <FeedbackButtons content={reading.aiInterpretation} />}
  //       {isComplete && (
  //         <div className="mt-10 flex justify-center fade-in">
  //           <Button
  //             variant="ghost"
  //             className="flex h-14 w-14 items-center justify-center rounded-full hover:text-primary"
  //             onClick={handleReset}
  //           >
  //             <IconClose className="h-20 w-20" />
  //           </Button>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }
  return <Loading />;
}

export default Interpreter;
