import { InitialQuestion } from "lib/quiz";

interface Props {
  section: InitialQuestion;
  onSelectOption: (question: string, option: number) => void;
  selectedOption: number;
}

const MultipleChoice = ({ section, onSelectOption, selectedOption }: Props) => {
  return (
    <div className="my-5">
      <h2 className="mb-10 block text-xl text-foreground">{section.statement}</h2>
      <div className="flex flex-col space-y-4">
        {section.choices.map((choice: any, index: any) => {
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
                name={section.statement}
                className="hidden"
                value={choice.option}
                onChange={() => onSelectOption(section.statement, choice.option)}
                checked={selected}
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
