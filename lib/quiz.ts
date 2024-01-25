export type Answer = {
  [key: string]: number;
};

export type Archetype = "explore" | "analyze" | "design" | "optimize" | "connect" | "nurture" | "energize" | "achieve";

export type Score = {
  [key in Archetype]: number;
};

type Points = {
  [key in Archetype]?: number;
};

type Choice = {
  option: string;
  points: Points;
};

export type Question = {
  choices: Choice[];
  prompt: string;
};

export type DeepQuestion = {
  section: string;
  archetype: Archetype;
  questions: string[];
};

export type InitialQuestion = {
  section: string;
  questions: Question[];
};

export const initialQuestions: InitialQuestion[] = [
  {
    section: "Macro/Micro Lens",
    questions: [
      {
        prompt:
          "Considering the saying 'not seeing the forest for the trees', where do you focus when faced with a new problem or situation?",
        choices: [
          {
            option: "Macro (I see the forest): I focus on the big picture, looking for overarching trends and patterns",
            points: {
              explore: 3,
              design: 3,
              connect: 3,
              energize: 3,
            },
          },
          {
            option: "Mostly Macro: While I consider the larger context, I do pay attention to key details",
            points: {
              explore: 2,
              design: 2,
              connect: 2,
              energize: 2,
              optimize: 1,
              analyze: 1,
              nurture: 1,
              achieve: 1,
            },
          },
          {
            option:
              "Balanced: (I see the forest and the trees) I like to see both the overall picture and the intricate details as needed",
            points: {
              explore: 1,
              design: 1,
              connect: 1,
              energize: 1,
              optimize: 1,
              analyze: 1,
              nurture: 1,
              achieve: 1,
            },
          },
          {
            option: "Mostly Micro: I tend to delve into the details, although I keep the broader implications in mind",
            points: {
              explore: 1,
              design: 1,
              connect: 1,
              energize: 1,
              optimize: 2,
              analyze: 2,
              nurture: 2,
              achieve: 2,
            },
          },
          {
            option: "Very Micro (I see the leaves): I concentrate on the specifics and fine points of the situation",
            points: {
              optimize: 3,
              analyze: 3,
              nurture: 3,
              achieve: 3,
            },
          },
        ],
      },
    ],
  },
  {
    section: "Head/Heart Lens",
    questions: [
      {
        prompt: "When faced with a decision or problem, which statement aligns more with your instinctive focus?",
        choices: [
          {
            option:
              "More Head: I tend to focus on ideas, employing facts and frameworks or constructing stories to make sense of situations",
            points: {
              explore: 3,
              analyze: 3,
            },
          },
          {
            option:
              "More Heart: I prioritize relationships, connecting people, nurturing talent, and understanding emotional dynamics",
            points: {
              connect: 3,
              nurture: 3,
            },
          },
          {
            option:
              "Even: I seek a balance, considering both logical narratives and the emotional dimensions of situations and relationships",
            points: {
              explore: 1,
              connect: 1,
              analyze: 1,
              nurture: 1,
            },
          },
        ],
      },
    ],
  },
  {
    section: "How/What Lens",
    questions: [
      {
        prompt:
          "In a collaborative project or when solving problems, which approach do you gravitate towards naturally?",
        choices: [
          {
            option:
              "More How: I am drawn to crafting the process, improving efficiency, and ensuring the design is effective",
            points: {
              design: 3,
              optimize: 3,
            },
          },
          {
            option:
              "More What: My focus is on achieving goals, driving results, and rallying the team around a shared objective for success",
            points: {
              achieve: 3,
              energize: 3,
            },
          },
          {
            option:
              "Blend of Both: I strike a balance, giving equal attention to design and efficiency, energy and execution",
            points: {
              design: 1,
              energize: 1,
              optimize: 1,
              achieve: 1,
            },
          },
        ],
      },
    ],
  },
];

export const questions: DeepQuestion[] = [
  {
    section: "Macro Head",
    archetype: "explore",
    questions: [
      "I thrive on discovering new ideas and conceptual frameworks; I am energized by exploring possibilities and abstract theories.",
    ],
  },
  {
    section: "Micro Head",
    archetype: "analyze",
    questions: [
      "I am drawn to data and analysis; I enjoy delving into the details to understand the mechanics of how things work.",
    ],
  },
  {
    section: "Macro How",
    archetype: "design",
    questions: [
      "I love to design systems and processes; I am focused on the efficiency and elegance of the overarching structure.",
    ],
  },
  {
    section: "Micro How",
    archetype: "optimize",
    questions: [
      "I am constantly looking for ways to make improvements and tweaks to existing systems to optimize performance.",
    ],
  },
  {
    section: "Macro Heart",
    archetype: "connect",
    questions: [
      "I prioritize building networks and fostering connections; I believe in the power of relationships to drive collaborative success.",
    ],
  },
  {
    section: "Micro Heart",
    archetype: "nurture",
    questions: [
      "I focus on the individual; I am attentive to personal development and emotional well-being in my approach to relationships.",
    ],
  },
  {
    section: "Macro What",
    archetype: "energize",
    questions: [
      "I am passionate about motivating others towards a common goal; I energize and mobilize teams to achieve shared objectives.",
    ],
  },
  {
    section: "Micro What",
    archetype: "achieve",
    questions: [
      "I am results-driven; I set specific goals and work diligently towards achieving them, often in a hands-on manner.",
    ],
  },
];

export function calculateInitialResults(answers: Record<string, Answer>) {
  // Initialize the results object with all archetypes set to 0
  const results: Score = {
    explore: 0,
    analyze: 0,
    design: 0,
    optimize: 0,
    connect: 0,
    nurture: 0,
    energize: 0,
    achieve: 0,
  };

  // Iterate over each answer
  Object.values(answers).forEach((answer) => {
    if (answer.points) {
      Object.entries(answer.points).forEach(([archetype, points]) => {
        if (archetype in results) {
          results[archetype as Archetype] += points;
        } else {
          console.warn(`Unrecognized archetype: ${archetype}`);
        }
      });
    }
  });

  return results;
}

export function calculateScores(answers: Answer, scores: Score): Score {
  const maxScorePerQuestion = 6;

  // Build questionToArchetypeMap and counters dynamically from the questions array
  questions.forEach((section) => {
    section.questions.forEach((question) => {
      scores[section.archetype] += answers[question] || 0; // Add score or zero if not answered
    });
  });

  // Normalize scores by dividing by the count of questions for each archetype
  Object.keys(scores).forEach((key) => {
    const archetype = key as Archetype;
    scores[archetype] = Number((scores[archetype] / maxScorePerQuestion).toFixed(2)) * 100; // Adjusted to 2 decimal places for consistency with database precision
  });

  // Return the normalized scores
  return scores;
}
