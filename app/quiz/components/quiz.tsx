"use client";
import { Button } from "components/ui/button";
import { calculateInitialResults, calculateScores, initialQuestions, questions } from "lib/quiz";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircledIcon, ColorWheelIcon } from "@radix-ui/react-icons";

type Answer = {
  [question: string]: number;
};

const QuestionItem = ({ question, answers, handleOptionChange, type }: any) => {
  const isDeepQuestion = type === "deep";

  return (
    <>
      {isDeepQuestion && (
        <p className="mb-2 font-semibold">
          Please rate how strongly you agree with the statement below a scale from 1 (not at all like me) to 5 (very
          much like me).
        </p>
      )}
      <label className="mb-5 block">{question.prompt || question}</label>
      <div className="flex flex-col gap-2">
        {(isDeepQuestion ? Array.from({ length: 5 }, (_, i) => ({ option: i + 1 })) : question.choices).map(
          (choice: any, index: any) => {
            const selected = isDeepQuestion
              ? answers[question] === choice.option
              : answers[question.prompt] === choice.option;
            return (
              <label
                key={index}
                className={`flex cursor-pointer items-center justify-between rounded-sm border bg-orange-50 p-2  hover:bg-orange-100 ${
                  selected ? "border-orange-500" : "border-orange-200"
                }`}
              >
                <input
                  type="radio"
                  name={question.prompt || question}
                  className="hidden"
                  value={choice.option}
                  onChange={() => handleOptionChange(question.prompt || question, choice.option)}
                  checked={selected}
                />
                <span className="ml-2">{isDeepQuestion ? choice.option : choice.option}</span>
                <div className="w-8">
                  {selected && <CheckCircledIcon width="25" height="25" className="text-orange-500" />}
                </div>
              </label>
            );
          }
        )}
      </div>
    </>
  );
};

const Question = ({ section, answers, handleOptionChange, initial }: any) => {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-bold">{section.section}</h2>
      {section.questions.map((question: any, questionIndex: number) => (
        <div key={questionIndex} className="mb-4">
          <QuestionItem
            question={question}
            answers={answers}
            handleOptionChange={handleOptionChange}
            type={initial ? "initial" : "deep"}
          />
        </div>
      ))}
    </div>
  );
};

const ThinkingStyleQuiz = ({ userId }: { userId: string }) => {
  const [answers, setAnswers] = useState<Answer>({});
  const [initialAnswers, setInitialAnswers] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);

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
    }, 500); // Adjust the timeout to match your animation duration
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!areAllQuestionsAnswered()) {
      alert("Please answer all questions before submitting.");
      return;
    }

    if (userId) {
      setIsLoading(true);
      const initialScores = calculateInitialResults(initialAnswers);
      const scores = calculateScores(answers, initialScores);

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
        router.push("/report");
      } else if (data.error) {
        console.error(data.error);
      }

      setIsLoading(false);
    } else {
      console.error("No user");
    }
  }

  const InitialInfo = () => (
    <div className="grid gap-2">
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
    if (isInitialInfo) {
      return <InitialInfo />;
    } else if (isInitialQuestions) {
      const section = initialQuestions[currentSectionIndex];
      return (
        <Question section={section} handleOptionChange={handleInitialOptionChange} answers={initialAnswers} initial />
      );
    } else {
      const section = questions[currentSectionIndex];
      return <Question section={section} handleOptionChange={handleOptionChange} answers={answers} />;
    }
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

  return (
    <div className="fad flex grow flex-col justify-between">
      <form onSubmit={handleSubmit} className={animationClasses}>
        {renderCurrentQuestions()}

        {currentPage === totalPages - 1 && (
          <Button type="submit" disabled={isLoading || !areAllQuestionsAnswered()} className="float-right">
            {isLoading ? (
              <>
                <ColorWheelIcon className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Submit"
            )}
          </Button>
        )}
      </form>
      <div className="">
        <Button className={currentPage <= 0 ? "hidden" : ""} onClick={() => handlePageChange(currentPage - 1)}>
          <ArrowLeftIcon />
        </Button>
        <Button
          className={currentPage >= totalPages - 1 ? "hidden" : " float-right"}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
};

export default ThinkingStyleQuiz;
