"use client";
import { Button } from "components/ui/button";
import {
  calculateMcqResults,
  quizQuestions,
  McqAnswer,
  Choice,
  combineScores,
  calculateRankingResults,
  Archetype,
  Score,
  RankingQuestion,
  calcScoresOver100,
} from "lib/quiz";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useTeamReport } from "lib/hooks/use-team-report";
import TieBreaker, { ArchetypeKey, FinalQuestionOption, archetypeStatements } from "./tie-breaker";
import InitialInfo from "./initial-info";
import MultipleChoice from "./multiple-choice";
import Rating from "./rating";
import Ranking from "./ranking";
import QuizNavigation from "./quiz-navigation";

const ThinkingStyleQuiz = ({ userId }: { userId: string }) => {
  const [mcqAnswers, setMcqAnswers] = useState<McqAnswer[]>();
  const [ratingAnswers, setRatingAnswers] = useState<Score>();
  const [rankingAnswers, setRankingAnswers] = useState<Choice[]>(
    (quizQuestions[0] as RankingQuestion).choices as Choice[]
  );
  const [finalAnswer, setFinalAnswer] = useState<ArchetypeKey>();
  const prevFinalAnswerRef = useRef<ArchetypeKey>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const { data: session } = useSession() as any;
  const { generateReport } = useTeamReport(session?.user?.teamId);

  const [finalQuestionVisible, setFinalQuestionVisible] = useState(false);
  const [finalQuestionOptions, setFinalQuestionOptions] = useState<FinalQuestionOption[]>([]);

  const [quizScores, setQuizScores] = useState<any>();

  const animationClasses = contentVisible ? "anim-fade-in" : "anim-fade-out";

  const router = useRouter();

  const totalPages = quizQuestions.length + 1;

  const isInitialInfo = currentPage === 0;

  // Determine the section index based on the current page
  let currentSectionIndex = 0;
  currentSectionIndex = currentPage - 1;

  const handlePageChange = (newPage: number) => {
    setContentVisible(false);
    setTimeout(() => {
      setCurrentPage(newPage);
      setContentVisible(true);
    }, 400);
  };

  const handleMcqChange = (statement: string, result: Choice) => {
    setMcqAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      [statement]: result, // Store the entire choice object
    }));
    if (currentPage != totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleRatingChange = (archetype: Archetype, result: number) => {
    setRatingAnswers((prevAnswers = {} as Score) => ({ ...prevAnswers, [archetype]: result }));
    if (currentPage != totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleRankingChange = (newArray: Choice[]) => {
    setRankingAnswers(newArray);
  };

  function getRankingArchetypes(archetypeScores: Score, placement: number): string[] {
    // Convert the scores object to an array of [archetype, score] pairs
    const scorePairs = Object.entries(archetypeScores);

    // Sort the pairs by score in descending order
    scorePairs.sort((a, b) => b[1] - a[1]);

    // Group archetypes with the same score
    const groupedByScore = scorePairs.reduce(
      (acc, [archetype, score]) => {
        if (!acc[score]) {
          acc[score] = [];
        }
        acc[score].push(archetype);
        return acc;
      },
      {} as { [score: number]: string[] }
    );

    // Get an array of score groups sorted by score
    const sortedGroups = Object.entries(groupedByScore)
      .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
      .map((entry) => entry[1]);

    // Check if the placement is valid
    if (placement - 1 < sortedGroups.length) {
      // Return the archetypes at the specified placement
      return sortedGroups[placement - 1];
    } else {
      // Return an empty array if the placement is out of bounds
      return [];
    }
  }

  // check all questions answered and calculate scores
  useEffect(() => {
    const allQuestionsAnswered = areAllQuestionsAnswered();
    if (allQuestionsAnswered && mcqAnswers) {
      // if (!quizScores) {
      const mcqScores = calculateMcqResults(mcqAnswers);
      const ratingScores = { ...ratingAnswers } as Score;
      const rankingScores = calculateRankingResults(rankingAnswers);
      const combinedScores = combineScores([mcqScores, ratingScores, rankingScores]);
      setQuizScores(combinedScores);
    }
  }, [mcqAnswers, ratingAnswers, rankingAnswers]);

  // check for tie-breakers
  useEffect(() => {
    if (quizScores) {
      let shouldShowSubmit = true;
      for (let i = 1; i <= 8; i++) {
        const currentPlace = getRankingArchetypes(quizScores, i) as ArchetypeKey[];
        if (currentPlace.length > 1) {
          showFinalQuestion(currentPlace);
          shouldShowSubmit = false;
          break;
        }
      }
      if (shouldShowSubmit) {
        setShowSubmit(true);
      }
    }
  }, [quizScores]);

  function calcScoresWithFinalAnswers(currentFinalAnswer: string, previousFinalAnswer?: string) {
    const updatedScores = { ...quizScores };

    finalQuestionOptions.forEach((finalQ) => {
      // If the option is not the current final answer, subtract points
      if (finalQ.style !== currentFinalAnswer) {
        updatedScores[finalQ.style] -= 1;
      } else if (finalQ.style === currentFinalAnswer && previousFinalAnswer) {
        updatedScores[finalQ.style] += 1;
      }
    });

    return updatedScores;
  }

  // re-calculate scores when a tie-breaker is answered
  useEffect(() => {
    if (finalAnswer) {
      const prevFinalAnswer = prevFinalAnswerRef.current;
      const updatedScores = calcScoresWithFinalAnswers(finalAnswer, prevFinalAnswer);
      setQuizScores(updatedScores);
      prevFinalAnswerRef.current = finalAnswer; // Update the ref to the current finalAnswer to reset the results if the user changes their selected option
    }
  }, [finalAnswer]);

  // reset the prevFinalAnswerRef when a new tie-breaker is shown
  useEffect(() => {
    if (finalQuestionOptions) {
      prevFinalAnswerRef.current = undefined;
      setFinalAnswer(undefined);
    }
  }, [finalQuestionOptions]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!areAllQuestionsAnswered()) {
      alert("Please answer all questions before submitting.");
      return;
    }

    if (userId && mcqAnswers) {
      const results = calcScoresOver100(quizScores);
      await saveResults(results);
    } else {
      console.error("No user");
    }
  }

  async function saveResults(results: Score) {
    setIsLoading(true);
    const res = await fetch("/api/quiz", {
      method: "POST",
      body: JSON.stringify({
        scores: results,
        userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = (await res.json()) as any;
    if (res.status === 201) {
      if (session?.user?.teamId) {
        generateReport();
      }
      router.push("/report");
    } else if (data.error) {
      console.error(data.error);
    }
    setIsLoading(false);
  }

  const handleFinalQuestionResponse = async (selectedStyle: ArchetypeKey) => {
    setFinalAnswer(selectedStyle);
  };

  const renderCurrentQuestions = () => {
    const section = quizQuestions[currentSectionIndex];
    if (isInitialInfo) {
      return <InitialInfo />;
    } else if (section.type === "mcq") {
      return (
        <MultipleChoice
          section={section}
          onSelectOption={handleMcqChange}
          selectedOption={mcqAnswers && (mcqAnswers[section.statement as keyof typeof mcqAnswers] as unknown as Choice)}
        />
      );
    } else if (section.type === "ranking") {
      return <Ranking section={section} currentOrder={rankingAnswers} onReorder={handleRankingChange} />;
    } else {
      return (
        <Rating
          section={section}
          onSelectOption={handleRatingChange}
          selectedOption={ratingAnswers ? ratingAnswers[section.archetype] : undefined}
        />
      );
    }
  };

  const showFinalQuestion = (competingScores: ArchetypeKey[]) => {
    const statements = competingScores.map((style) => ({
      style,
      statement: archetypeStatements[style],
    }));
    setFinalQuestionOptions(statements);
    setFinalQuestionVisible(true);
  };

  const areAllQuestionsAnswered = () => {
    for (let section of quizQuestions) {
      if (section.type === "mcq") {
        if (!mcqAnswers || mcqAnswers[section.statement as keyof typeof mcqAnswers] === undefined) {
          return false;
        }
      }
      if (section.type === "rating") {
        if (!ratingAnswers || ratingAnswers[section.archetype as keyof typeof ratingAnswers] === undefined) {
          return false;
        }
      }
    }
    return true;
  };

  const SubmitButton = () => (
    <Button onClick={handleSubmit} disabled={isLoading || !areAllQuestionsAnswered()} className="float-right">
      {isLoading ? (
        <>
          <ColorWheelIcon className="mr-2 h-4 w-4 animate-spin" />
          Processing
        </>
      ) : (
        "Submit"
      )}
    </Button>
  );

  return (
    <div className="fad flex grow flex-col justify-between">
      <h1 className="text-2xl font-bold">Discover your thinking style</h1>
      <div className={animationClasses}>
        {finalQuestionVisible ? (
          <TieBreaker
            options={finalQuestionOptions}
            selectedStyle={finalAnswer}
            onSelectOption={handleFinalQuestionResponse}
          />
        ) : (
          <>
            {currentPage !== 0 && (
              <p className="mb-4 text-sm text-muted-foreground">
                {currentPage}/{totalPages - 1}
              </p>
            )}
            {renderCurrentQuestions()}
          </>
        )}
      </div>
      <QuizNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        finalQuestionVisible={finalQuestionVisible}
        showSubmit={showSubmit}
        handlePageChange={handlePageChange}
        SubmitButton={() => <SubmitButton />}
      />
    </div>
  );
};

export default ThinkingStyleQuiz;
