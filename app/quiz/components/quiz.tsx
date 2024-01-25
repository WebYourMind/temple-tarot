"use client";
import { Button } from "components/ui/button";
import { Score, calculateInitialResults, calculateScores, initialQuestions, questions } from "lib/quiz";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ColorWheelIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useTeamReport } from "lib/hooks/use-team-report";
import Question from "./question";

type Answer = {
  [question: string]: number;
};

const archetypeStatements = {
  explore: "I am always looking for new experiences and ideas.",
  analyze: "I seek to achieve objectivity and insight, often delving into the details.",
  design: "I am concerned with designing effective systems and processes.",
  optimize: "I constantly seek to improve productivity and efficiency, fine-tuning processes.",
  connect: "I focus on building and strengthening relationships, emphasizing interpersonal aspects.",
  nurture: "I am dedicated to cultivating people and potential, focusing on personal development.",
  energize: "I aim to mobilize people into action and inspire enthusiasm.",
  achieve: "I am driven to achieve completion and maintain momentum, often being action-oriented.",
};

type ArchetypeKey = keyof typeof archetypeStatements;

type FinalQuestionOption = {
  style: ArchetypeKey;
  statement: string;
};

const ThinkingStyleQuiz = ({ userId }: { userId: string }) => {
  const [answers, setAnswers] = useState<Answer>({});
  const [initialAnswers, setInitialAnswers] = useState<any>({});
  const [finalAnswer, setFinalAnswer] = useState<any>({});
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

  const handleInitialOptionChange = (questionPrompt: string, selectedChoice: any) => {
    setInitialAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      [questionPrompt]: selectedChoice, // Store the entire choice object
    }));
    handlePageChange(currentPage + 1);
  };

  const handleOptionChange = (question: string, score: number) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [question]: score }));
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
      const scores = calculateScores(answers, initialScores);
      setQuizScores(scores);

      const highscores = getHighestRankingArchetypes(scores) as ArchetypeKey[];
      if (highscores.length > 1) {
        askFinalQuestion(highscores);
      } else {
        await saveResults(scores);
      }
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

  const InitialInfo = () => (
    <div className="space-y-4 text-lg">
      <p>
        For this assessment, we aim to understand your natural way of thinking. This isn&apos;t about what you strive to
        do but rather how you inherently process information and respond to situations, akin to being right or
        left-handed.
      </p>
      <p>
        Your Thinking Styles are viewed through three lenses: the Macro or Micro perspective, the balance between Head
        and Heart, and the interplay of How and What.
      </p>
      <p>
        Initially, we&apos;ll determine your dominant style with broad questions, then we&apos;ll delve deeper for a
        more nuanced understanding.
      </p>
    </div>
  );

  const renderCurrentQuestions = () => {
    if (finalQuestionVisible) {
      return renderFinalQuestion();
    }

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

  const renderFinalQuestion = () => (
    <div className="mb-8">
      <h2 className="mb-5 text-xl font-bold">Select the statement you identify with most:</h2>
      {finalQuestionOptions.map((option, index) => (
        <label
          key={index}
          className={`mb-2 flex cursor-pointer items-center justify-between rounded-sm border p-2 hover:bg-accent hover:text-accent-foreground ${
            finalAnswer === option.style
              ? "border-primary bg-primary text-primary-foreground"
              : "border-card bg-card text-card-foreground"
          }`}
        >
          <input
            type="radio"
            name="finalQuestion"
            className="hidden"
            value={option.style}
            onChange={() => handleFinalQuestionResponse(option.style)}
          />
          {option.statement}
        </label>
      ))}
    </div>
  );

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
      for (let question of section.questions) {
        if (initialAnswers[question.prompt] === undefined) {
          return false;
        }
      }
    }
    for (let section of questions) {
      for (let question of section.questions) {
        if (answers[question] === undefined) {
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
      <form onSubmit={handleSubmit} className={animationClasses}>
        {finalQuestionVisible ? renderFinalQuestion() : renderCurrentQuestions()}
      </form>
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
