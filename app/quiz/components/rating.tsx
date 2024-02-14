import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Archetype, RatingQuestion } from "lib/quiz";

interface RatingProps {
  section: RatingQuestion;
  onSelectOption: (archetype: Archetype, option: number) => void;
  selectedOption?: number;
}

const Rating = ({ section, onSelectOption, selectedOption }: RatingProps) => {
  const options = [
    { value: 0, size: "w-12 h-12 border-purple-400" },
    { value: 3, size: "w-10 h-10 border-purple-400" },
    { value: 6, size: "w-10 h-10 border-green-400" },
    { value: 10, size: "w-12 h-12 border-green-400" },
  ];

  return (
    <div className="my-5 flex flex-col items-center justify-center p-4">
      <p className="mb-4 text-center text-lg text-muted-foreground">
        Please rate how likely or how often someone would come to you for help in this area:
      </p>
      <p className="mb-16 text-center text-2xl">{section.statement as string}</p>
      <div className="flex w-full items-center md:max-w-lg">
        <span className="mr-4 hidden text-center text-lg font-medium md:block">RARELY</span>
        <div className="flex w-full items-center justify-between">
          {options.map((option, index) => (
            <div key={index} className="relative">
              <input
                id={`radio-${index}`}
                type="radio"
                name="quizOption"
                value={option.value}
                checked={selectedOption === option.value}
                onChange={() => onSelectOption(section.archetype as Archetype, option.value)}
                className="sr-only" // Hide the actual input but keep it accessible
              />
              <label htmlFor={`radio-${index}`} className="block cursor-pointer">
                <span className={`block ${option.size} rounded-full border-2 md:hover:bg-secondary`}></span>
              </label>
              {selectedOption === option.value && (
                <span className="absolute left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-primary-foreground bg-primary text-primary-foreground">
                  <CheckCircledIcon className="h-full w-full" />
                </span>
              )}
            </div>
          ))}
        </div>
        <span className="ml-4 hidden text-center text-lg font-medium md:block">VERY OFTEN</span>
      </div>
      <div className="mt-5 flex w-full justify-between md:hidden">
        <span>RARELY</span>
        <span>VERY OFTEN</span>
      </div>
    </div>
  );
};

export default Rating;
