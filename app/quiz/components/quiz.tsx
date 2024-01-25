"use client";
import { Button } from "components/ui/button";
import { Score, calculateInitialResults, calculateScores, initialQuestions, questions } from "lib/quiz";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ColorWheelIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useTeamReport } from "lib/hooks/use-team-report";
import Question from "./question-item";
import TieBreaker, { ArchetypeKey, FinalQuestionOption, archetypeStatements } from "./tie-breaker";
import InitialInfo from "./initial-info";

type Answer = {
  [question: string]: number;
};

const ThinkingStyleQuiz = ({ userId }: { userId: string }) => {
  const [answers, setAnswers] = useState<Answer>({});
  const [initialAnswers, setInitialAnswers] = useState<any>({});
  const [finalAnswer, setFinalAnswer] = useState<ArchetypeKey>();
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

  const totalPages = questions.length + initialQuestions.length + 1;

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

  const handleInitialOptionChange = (statement: string, selectedChoice: any) => {
    setInitialAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      [statement]: selectedChoice, // Store the entire choice object
    }));
    handlePageChange(currentPage + 1);
  };

  const handleOptionChange = (statement: string, score: number) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [statement]: score }));
    if (currentPage != totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
  };

  function getHighestRankingArchetypes(scores: any) {
    // Find the highest score value
    const highestScore = Math.max(...(Object.values(scores) as number[]));

    // Filter and return the archetypes with the highest score
    return Object.keys(scores).filter((key) => scores[key] === highestScore);
  }

  useEffect(() => {
    // are all questions answered
    // calculate scores
    // check if tie breakers
    // if so, show finalQuestion
    // else show submit
    const allQuestionsAnswered = areAllQuestionsAnswered();
    if (allQuestionsAnswered) {
      const initialScores = calculateInitialResults(initialAnswers);
      const scores = calculateScores(answers, initialScores);
      setQuizScores(scores);

      const highscores = getHighestRankingArchetypes(scores) as ArchetypeKey[];
      if (highscores.length > 1) {
        askFinalQuestion(highscores);
      } else {
        setShowSubmit(true);
      }
    }
  }, [answers, initialAnswers]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!areAllQuestionsAnswered()) {
      alert("Please answer all questions before submitting.");
      return;
    }

    if (userId) {
      const initialScores = calculateInitialResults(initialAnswers);
      let scores = calculateScores(answers, initialScores);
      setQuizScores(scores);

      if (finalAnswer) {
        scores[finalAnswer] += 7;
      }

      await saveResults(scores);
    } else {
      console.error("No user");
    }
  }

  async function saveResults(scores: Score) {
    setIsLoading(true);
    const res = await fetch("/api/quiz", {
      method: "POST",
      body: JSON.stringify({
        scores,
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
    const updatedScores = { ...quizScores, [selectedStyle]: quizScores[selectedStyle] + 5 };
    setFinalAnswer(selectedStyle);
    setQuizScores(updatedScores);
    setShowSubmit(true);
  };

  const renderCurrentQuestions = () => {
    if (isInitialInfo) {
      return <InitialInfo />;
    } else if (isInitialQuestions) {
      const section = initialQuestions[currentSectionIndex];
      return (
        <Question
          section={section}
          onSelectOption={handleInitialOptionChange}
          answers={initialAnswers}
          type="initial"
        />
      );
    } else {
      const section = questions[currentSectionIndex];
      return <Question section={section} onSelectOption={handleOptionChange} answers={answers} type="deep" />;
    }
  };

  const askFinalQuestion = (highscores: ArchetypeKey[]) => {
    const statements = highscores.map((style) => ({
      style,
      statement: archetypeStatements[style],
    }));
    setFinalQuestionOptions(statements);
    setFinalQuestionVisible(true);
  };

  const areAllQuestionsAnswered = () => {
    for (let section of initialQuestions) {
      if (initialAnswers[section.statement] === undefined) {
        return false;
      }
    }
    for (let section of questions) {
      if (answers[section.statement] === undefined) {
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
