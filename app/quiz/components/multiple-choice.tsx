import { Choice, MCQQuestion } from "lib/quiz";

interface Props {
  section: MCQQuestion;
  onSelectOption: (question: string, choice: Choice) => void;
  selectedOption?: Choice;
}

const MultipleChoice = ({ section, onSelectOption, selectedOption }: Props) => {
  return (
    <div className="my-5">
      <h2 className="mb-10 block text-xl text-foreground">{section.statement}</h2>
      <div className="flex flex-col space-y-4">
        {section.choices?.map((choice: Choice) => {
          const isSelected = selectedOption?.option === choice.option;
          return (
            <label
              key={choice.option}
              className={`flex cursor-pointer items-center justify-between rounded-sm border p-2 ${
                isSelected
                  ? "border-primary-foreground bg-primary text-primary-foreground"
                  : "border-muted-foreground bg-background text-foreground"
              } md:hover:bg-accent md:hover:text-accent-foreground`}
            >
              <input
                type="radio"
                name={section.statement}
                className="hidden"
                value={choice.option}
                onChange={() => onSelectOption(section.statement, choice)}
                checked={isSelected}
              />
              <span className="ml-2">{choice.option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoice;
