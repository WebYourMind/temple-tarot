import { Question } from "lib/quiz";

interface Props {
  question: Question;
  onSelectOption: (question: string, option: number) => void;
  selectedOption: number;
}

const MultipleChoice = ({ question, onSelectOption, selectedOption }: Props) => {
  return (
    <>
      <h2 className="mb-10 block text-xl text-foreground">{question.prompt}</h2>
      <div className="flex flex-col space-y-4">
        {question.choices.map((choice: any, index: any) => {
          const selected = selectedOption === choice.option;
          return (
            <label
              key={index}
              className={`flex cursor-pointer items-center justify-between rounded-sm border p-2 ${
                selected
                  ? "border-primary-foreground bg-primary text-primary-foreground"
                  : "border-muted-foreground bg-background text-foreground"
              } hover:bg-accent hover:text-accent-foreground`}
            >
              <input
                type="radio"
                name={question.prompt}
                className="hidden"
                value={choice.option}
                onChange={() => onSelectOption(question.prompt, choice.option)}
                checked={selected}
              />
              <span className="ml-2">{choice.option}</span>
            </label>
          );
        })}
      </div>
    </>
  );
};

export default MultipleChoice;
