"use client";
import { Button } from "components/ui/button";
import { calculateInitialResults, calculateScores, initialQuestions, questions } from "lib/quiz";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ColorWheelIcon } from "@radix-ui/react-icons";

type Answer = {
  [question: string]: number;
};

const ThinkingStyleQuiz = ({ userId }: { userId: string }) => {
  const [answers, setAnswers] = useState<Answer>({});
  const [initialAnswers, setInitialAnswers] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleInitialOptionChange = (questionPrompt: string, selectedChoice: any) => {
    setInitialAnswers((prevAnswers: any) => ({
      ...prevAnswers,
      [questionPrompt]: selectedChoice, // Store the entire choice object
    }));
  };

  const handleOptionChange = (question: string, score: number) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [question]: score }));
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-2 font-semibold">
        For this assessment, we aim to understand your natural way of thinking. This isn&apos;t about what you strive to
        do but how you inherently process information and respond to situations, akin to being right or left-handed.
      </p>
      <p className="text-md mb-5 font-semibold">
        Your Thinking Styles are viewed through three lenses: Macro or Micro, Head and Heart, and Means and Ends.
        Initially, we&apos;ll determine your dominant style with broad questions. If you&apos;re interested, we can then
        delve deeper for a more nuanced understanding.
      </p>
      {initialQuestions.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <h2 className="mb-4 text-xl font-bold">{section.section}</h2>
          {section.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-4">
              <label className="mb-2 block font-medium text-gray-900 dark:text-gray-400">{question.prompt}</label>
              <div className="flex flex-col gap-4">
                {question.choices.map((choice, choiceIndex) => (
                  <label key={choiceIndex} className="flex items-center">
                    <input
                      type="radio"
                      name={question.prompt}
                      className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      value={choice.option}
                      onChange={() => handleInitialOptionChange(question.prompt, choice)}
                      checked={initialAnswers[question.prompt]?.option === choice.option}
                    />
                    <span className="ml-2">{choice.option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      <p className="text-md mb-5 font-semibold">
        Please rate how strongly you agree with each statement below on a scale from 1 (not at all like me) to 5 (very
        much like me).
      </p>
      {questions.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <h2 className="mb-4 text-xl font-bold">{section.section}</h2>
          {section.questions.map((question: string, questionIndex: number) => (
            <div key={questionIndex} className="mb-4">
              <label className="mb-2 block">{question}</label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <label key={index} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={question}
                      value={index + 1}
                      onChange={() => handleOptionChange(question, index + 1)}
                      checked={answers[question] === index + 1}
                    />
                    <span className="ml-2">{index + 1}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      <Button type="submit" disabled={isLoading}>
        {isLoading && <ColorWheelIcon className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Processing" : "Submit"}
      </Button>
    </form>
  );
};

export default ThinkingStyleQuiz;
