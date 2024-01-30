"use client";
import { Button } from "components/ui/button";
import {
  Score,
  calculateInitialResults,
  calculateScores,
  initialQuestions,
  deepQuestions,
  Answer,
  InitialAnswer,
  Choice,
} from "lib/quiz";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ColorWheelIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useTeamReport } from "lib/hooks/use-team-report";
import TieBreaker, { ArchetypeKey, FinalQuestionOption, archetypeStatements } from "./tie-breaker";
import InitialInfo from "./initial-info";
import MultipleChoice from "./multiple-choice";
import AgreeDisagree from "./agree-disagree";

const ThinkingStyleQuiz = ({ userId }: { userId: string }) => {
  const [initialAnswers, setInitialAnswers] = useState<InitialAnswer[]>();
  const [deepAnswers, setDeepAnswers] = useState<Answer>({});
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

  const totalPages = deepQuestions.length + initialQuestions.length + 1;

  const isInitialInfo = currentPage === 0;
  const isInitialQuestions = currentPage > 0 && currentPage <= initialQuestions.length;
  const isDeepQuestions = currentPage > initialQuestions.length;

  // Determine the section index based on the current page
  let currentSectionIndex = 0;
  if (isInitialQuestions) {
    currentSectionIndex = currentPage - 1;
  } else if (isDeepQuestions) {
    currentSectionIndex = currentPage - initialQuestions.length - 1;
  }

  const handlePageChange = (newPage: number) => {
    setContentVisible(false);
    setTimeout(() => {
      setCurrentPage(newPage);
      setContentVisible(true);
    }, 400);
  };

  const handleInitialOptionChange = (statement: string, result: Choice) => {
    setInitialAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      [statement]: result, // Store the entire choice object
    }));
    handlePageChange(currentPage + 1);
  };

  const handleOptionChange = (statement: string, result: number) => {
    setDeepAnswers((prevAnswers) => ({ ...prevAnswers, [statement]: result }));
    if (currentPage != totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
  };

  function getRankingArchetypes(archetypeScores: Answer, placement: number): string[] {
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

  useEffect(() => {
    const allQuestionsAnswered = areAllQuestionsAnswered();
    if (allQuestionsAnswered && initialAnswers) {
      if (!quizScores) {
        const initialScores = calculateInitialResults(initialAnswers);
        const scores = calculateScores(deepAnswers, initialScores);
        setQuizScores(scores);
      }
    }
  }, [initialAnswers, deepAnswers]);

  useEffect(() => {
    if (quizScores) {
      const firstPlace = getRankingArchetypes(quizScores, 1) as ArchetypeKey[];
      if (firstPlace.length > 1) {
        showFinalQuestion(firstPlace);
      } else {
        const secondPlace = getRankingArchetypes(quizScores, 2) as ArchetypeKey[];
        if (secondPlace.length > 1) {
          showFinalQuestion(secondPlace);
        } else {
          setShowSubmit(true);
        }
      }
    }
  }, [quizScores]);

  function calcScoresWithFinalAnswers(currentFinalAnswer: string, previousFinalAnswer?: string) {
    const updatedScores = { ...quizScores };

    finalQuestionOptions.forEach((finalQ) => {
      // If the option is not the current final answer, subtract points
      if (finalQ.style !== currentFinalAnswer) {
        updatedScores[finalQ.style] -= 2;
      } else if (finalQ.style === currentFinalAnswer && previousFinalAnswer) {
        updatedScores[finalQ.style] += 2;
      }
    });

    return updatedScores;
  }

  useEffect(() => {
    if (finalAnswer) {
      const prevFinalAnswer = prevFinalAnswerRef.current;
      const updatedScores = calcScoresWithFinalAnswers(finalAnswer, prevFinalAnswer);
      setQuizScores(updatedScores);
      prevFinalAnswerRef.current = finalAnswer; // Update the ref to the current finalAnswer
    }
  }, [finalAnswer]);

  useEffect(() => {
    if (finalQuestionOptions) {
      prevFinalAnswerRef.current = undefined;
    }
  }, [finalQuestionOptions]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!areAllQuestionsAnswered()) {
      alert("Please answer all questions before submitting.");
      return;
    }

    if (userId && initialAnswers) {
      await saveResults();
    } else {
      console.error("No user");
    }
  }

  async function saveResults() {
    setIsLoading(true);
    const res = await fetch("/api/quiz", {
      method: "POST",
      body: JSON.stringify({
        scores: quizScores,
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
    if (isInitialInfo) {
      return <InitialInfo />;
    } else if (isInitialQuestions) {
      const section = initialQuestions[currentSectionIndex];
      return (
        <MultipleChoice
          section={section}
          onSelectOption={handleInitialOptionChange}
          selectedOption={
            initialAnswers && (initialAnswers[section.statement as keyof typeof initialAnswers] as unknown as Choice)
          }
        />
      );
    } else {
      const section = deepQuestions[currentSectionIndex];
      return (
        <AgreeDisagree
          section={section}
          onSelectOption={handleOptionChange}
          selectedOption={deepAnswers[section.statement]}
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
    for (let section of initialQuestions) {
      if (!initialAnswers || initialAnswers[section.statement as keyof typeof initialAnswers] === undefined) {
        return false;
      }
    }
    for (let section of deepQuestions) {
      if (deepAnswers[section.statement] === undefined) {
        return false;
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
          renderCurrentQuestions()
        )}
      </div>
      {/* Quiz Navigation & Submit */}
      {!finalQuestionVisible ? (
        <div>
          <Button
            variant={"outline"}
            className={currentPage <= 0 ? "hidden" : ""}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ArrowLeftIcon />
          </Button>
          {showSubmit && currentPage >= totalPages - 1 ? (
            <SubmitButton />
          ) : (
            <Button
              variant={currentPage === 0 ? "default" : "outline"}
              className={currentPage >= totalPages - 1 ? "hidden" : " float-right space-x-1"}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              {currentPage === 0 && <span>Start</span>}
              <ArrowRightIcon />
            </Button>
          )}
        </div>
      ) : showSubmit ? (
        <div>
          <SubmitButton />
        </div>
      ) : (
        <div className="h-10" />
      )}
    </div>
  );
};

export default ThinkingStyleQuiz;
