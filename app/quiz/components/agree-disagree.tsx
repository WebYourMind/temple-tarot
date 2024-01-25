import { DeepQuestion } from "lib/quiz";

interface AgreeDisagreeProps {
  section: DeepQuestion;
  onSelectOption: (question: string, option: number) => void;
  selectedOption: number;
}

const AgreeDisagree = ({ section, onSelectOption, selectedOption }: AgreeDisagreeProps) => {
  const options = [
    { value: 0, size: "w-12 h-12 border-purple-400" },
    { value: 1, size: "w-10 h-10 border-purple-400" },
    { value: 2, size: "w-8 h-8 border-muted-foreground" },
    { value: 3, size: "w-10 h-10 border-green-400" },
    { value: 4, size: "w-12 h-12 border-green-400" },
  ];

  return (
    <div className="my-5 flex flex-col items-center justify-center p-4">
      <p className="mb-16 text-center text-2xl">{section.statement as string}</p>
      <div className="flex w-full items-center md:max-w-lg">
        <span className="mr-4 hidden text-lg font-medium md:block">DISAGREE</span>
        <div className="flex w-full items-center justify-between">
          {options.map((option, index) => (
            <div key={index} className="relative">
              <input
                id={`radio-${index}`}
                type="radio"
                name="quizOption"
                value={option.value}
                checked={selectedOption === option.value}
                onChange={() => onSelectOption(section.statement as string, option.value)}
                className="sr-only" // Hide the actual input but keep it accessible
              />
              <label htmlFor={`radio-${index}`} className="block cursor-pointer">
                <span className={`block ${option.size} rounded-full border-2 hover:bg-accent`}></span>
              </label>
              {selectedOption === option.value && (
                <span className="absolute left-1/2 top-1/2 block h-full w-full -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-foreground bg-primary"></span>
              )}
            </div>
          ))}
        </div>
        <span className="ml-4 hidden text-lg font-medium md:block">AGREE</span>
      </div>
      <div className="mt-5 flex w-full justify-between md:hidden">
        <span>DISAGREE</span>
        <span>AGREE</span>
      </div>
    </div>
  );
};

export default AgreeDisagree;
