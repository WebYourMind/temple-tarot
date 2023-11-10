"use client";
import { Button } from "components/ui/button";
import { calculateScores, questions } from "lib/quiz";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ColorWheelIcon } from "@radix-ui/react-icons";

type Answer = {
  [question: string]: number;
};

const ThinkingStyleQuiz = ({ userId }: { userId: string }) => {
  const [answers, setAnswers] = useState<Answer>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleOptionChange = (question: string, score: number) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [question]: score }));
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (userId) {
      setIsLoading(true);
      const scores = calculateScores(answers);
      //   const scores = {
      //     analytical: "0.73",
      //     creative: "0.93",
      //     practical: "0.80",
      //     reflective: "1.00",
      //     interpersonal: "0.87",
      //     logical: "0.93",
      //   };

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
        console.log("success", data);
      } else if (data.error) {
        console.error(data.error);
      }

      setIsLoading(false);
    } else {
      console.error("No user");
    }
  }

  return (
    <div className="container mx-auto my-16 flex justify-center">
      <form onSubmit={handleSubmit}>
        {questions.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h2 className="mb-4 text-xl font-bold">{section.section}</h2>
            {section.questions.map((question: string, questionIndex: number) => (
              <div key={questionIndex} className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400">{question}</label>
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
    </div>
  );
};

export default ThinkingStyleQuiz;
