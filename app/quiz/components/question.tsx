import { Answer, DeepQuestion, InitialQuestion } from "lib/quiz";
import AgreeDisagree from "./agree-disagree";
import MultipleChoice from "./multiple-choice";

interface QuestionItemProps {
  question: string | any; // Consider a more specific type here
  answers: Answer; // Consider a more specific type here
  onSelectOption: (question: string, score: number) => void;
  type: "deep" | "initial";
}

interface QuestionProps {
  section: InitialQuestion | DeepQuestion;
  answers: Answer;
  onSelectOption: (question: string, score: number) => void;
  type: "deep" | "initial";
}

const QuestionItem = ({ question, answers, onSelectOption, type }: QuestionItemProps) => {
  const isDeepQuestion = type === "deep";

  if (isDeepQuestion) {
    return <AgreeDisagree question={question} onSelectOption={onSelectOption} selectedOption={answers[question]} />;
  }

  return (
    <MultipleChoice question={question} selectedOption={answers[question.prompt]} onSelectOption={onSelectOption} />
  );
};

const Question = ({ section, answers, onSelectOption, type }: QuestionProps) => {
  return (
    <div className="my-5">
      {section.questions.map((question: any, questionIndex: number) => (
        <QuestionItem
          key={questionIndex}
          question={question}
          answers={answers}
          onSelectOption={onSelectOption}
          type={type}
        />
      ))}
    </div>
  );
};

export default Question;
