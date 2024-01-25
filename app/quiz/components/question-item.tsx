import { Answer, DeepQuestion, InitialQuestion } from "lib/quiz";
import AgreeDisagree from "./agree-disagree";
import MultipleChoice from "./multiple-choice";

interface QuestionItemProps {
  section: InitialQuestion | DeepQuestion;
  answers: Answer;
  onSelectOption: (question: string, score: number) => void;
  type: "deep" | "initial";
}

const QuestionItem = ({ section, answers, onSelectOption, type }: QuestionItemProps) => {
  const isInitialQuestion = type === "initial";

  if (isInitialQuestion) {
    return (
      <MultipleChoice
        section={section as InitialQuestion}
        selectedOption={answers[section.statement]}
        onSelectOption={onSelectOption}
      />
    );
  }

  return (
    <AgreeDisagree
      section={section as DeepQuestion}
      onSelectOption={onSelectOption}
      selectedOption={answers[section.statement]}
    />
  );
};

export default QuestionItem;
