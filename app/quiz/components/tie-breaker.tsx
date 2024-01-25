export const archetypeStatements = {
  explore: "I am always looking for new experiences and ideas.",
  analyze: "I seek to achieve objectivity and insight, often delving into the details.",
  design: "I am concerned with designing effective systems and processes.",
  optimize: "I constantly seek to improve productivity and efficiency, fine-tuning processes.",
  connect: "I focus on building and strengthening relationships, emphasizing interpersonal aspects.",
  nurture: "I am dedicated to cultivating people and potential, focusing on personal development.",
  energize: "I aim to mobilize people into action and inspire enthusiasm.",
  achieve: "I am driven to achieve completion and maintain momentum, often being action-oriented.",
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
    <h2 className="mb-5 text-xl font-bold">Select the statement you identify with most:</h2>
    {options.map((option, index) => (
      <label
        key={index}
        className={`mb-2 flex cursor-pointer items-center justify-between rounded-sm border p-2 hover:bg-accent hover:text-accent-foreground ${
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
