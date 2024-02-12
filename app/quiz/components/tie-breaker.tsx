export const archetypeStatements = {
  explore: "Is there a better solution?",
  analyze: "Do we have enough data?",
  connect: "Did we talk to the right people?",
  nurture: "Is everyone being included?",
  plan: "How are we going to implement this?",
  optimize: "Can we use less time or money?",
  energize: "Is everyone feeling excited?",
  achieve: "What are the next steps?",
};

export type ArchetypeKey = keyof typeof archetypeStatements;

export type FinalQuestionOption = {
  style: ArchetypeKey;
  statement: string;
};

interface Props {
  options: FinalQuestionOption[];
  selectedStyle?: ArchetypeKey;
  onSelectOption: (style: ArchetypeKey) => void;
}

const TieBreaker = ({ options, selectedStyle, onSelectOption }: Props) => (
  <div className="mb-8">
    <p className="mb-4 text-sm text-muted-foreground">Tie-Breaker Question</p>
    <h2 className="mb-5 text-xl font-bold">
      Assuming you are in a business meeting, which of the following are you most likely to think or say:
    </h2>
    {options.map((option, index) => (
      <label
        key={option.style}
        className={`mb-2 flex cursor-pointer items-center justify-between rounded-sm border p-2 md:hover:bg-accent md:hover:text-accent-foreground ${
          selectedStyle === option.style
            ? "border-primary bg-primary text-primary-foreground"
            : "border-card bg-card text-card-foreground"
        }`}
      >
        <input
          type="radio"
          name="finalQuestion"
          className="hidden"
          value={option.style}
          onChange={() => onSelectOption(option.style)}
        />
        {option.statement}
      </label>
    ))}
  </div>
);

export default TieBreaker;
