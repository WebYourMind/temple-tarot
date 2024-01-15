type Answer = {
  [key: string]: number;
};

export type Archetype =
  | "explorer"
  | "expert"
  | "planner"
  | "optimizer"
  | "connector"
  | "coach"
  | "energizer"
  | "producer";

export type Score = {
  [key in Archetype]: number;
};

type QuestionSection = {
  section: string;
  archetype: Archetype;
  questions: string[];
};

export const initialQuestions = [
  {
    section: "Macro/Micro Lens",
    questions: [
      {
        prompt:
          "Considering the saying about the forest and the trees, where do you focus when faced with a new problem or situation?",
        choices: [
          {
            option: "Macro (I see the forest): I focus on the big picture, looking for overarching trends and patterns",
            points: {
              explorer: 3,
              planner: 3,
              connector: 3,
              energizer: 3,
            },
          },
          {
            option: "Mostly Macro: While I consider the larger context, I do pay attention to key details",
            points: {
              explorer: 2,
              planner: 2,
              connector: 2,
              energizer: 2,
              optimizer: 1,
              expert: 1,
              coach: 1,
              producer: 1,
            },
          },
          {
            option:
              "Balanced: (I see the forest and the trees) I like to see both the overall picture and the intricate details as needed",
            points: {
              explorer: 1,
              planner: 1,
              connector: 1,
              energizer: 1,
              optimizer: 1,
              expert: 1,
              coach: 1,
              producer: 1,
            },
          },
          {
            option: "Mostly Micro: I tend to delve into the details, although I keep the broader implications in mind",
            points: {
              explorer: 1,
              planner: 1,
              connector: 1,
              energizer: 1,
              optimizer: 2,
              expert: 2,
              coach: 2,
              producer: 2,
            },
          },
          {
            option: "Very Micro (I see the leaves): I concentrate on the specifics and fine points of the situation",
            points: {
              optimizer: 3,
              expert: 3,
              coach: 3,
              producer: 3,
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
            lens: "Head",
            points: {
              explorer: 3,
              expert: 3,
            },
          },
          {
            option:
              "More Heart: I prioritize relationships, connecting people, nurturing talent, and understanding emotional dynamics",
            lens: "Heart",
            points: {
              connector: 3,
              coach: 3,
            },
          },
          {
            option:
              "Even: I seek a balance, considering both logical narratives and the emotional dimensions of situations and relationships",
            lens: "Balanced",
            points: {
              explorer: 1,
              connector: 1,
              expert: 1,
              coach: 1,
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
            lens: "How",
            points: {
              planner: 3,
              optimizer: 3,
            },
          },
          {
            option:
              "More What: My focus is on achieving goals, driving results, and rallying the team around a shared objective for success",
            lens: "What",
            points: {
              producer: 3,
              energizer: 3,
            },
          },
          {
            option:
              "Blend of Both: I strike a balance, giving equal attention to design and efficiency, energy and execution",
            lens: "Balanced",
            points: {
              planner: 1,
              energizer: 1,
              optimizer: 1,
              producer: 1,
            },
          },
        ],
      },
    ],
  },
];

export const questions: QuestionSection[] = [
  {
    section: "Macro Head",
    archetype: "explorer",
    questions: [
      "I thrive on discovering new ideas and conceptual frameworks; I am energized by exploring possibilities and abstract theories.",
    ],
  },
  {
    section: "Micro Head",
    archetype: "expert",
    questions: [
      "I am drawn to data and analysis; I enjoy delving into the details to understand the mechanics of how things work.",
    ],
  },
  {
    section: "Macro How",
    archetype: "planner",
    questions: [
      "I love to design systems and processes; I am focused on the efficiency and elegance of the overarching structure.",
    ],
  },
  {
    section: "Micro How",
    archetype: "optimizer",
    questions: [
      "I am constantly looking for ways to make improvements and tweaks to existing systems to optimize performance.",
    ],
  },
  {
    section: "Macro Heart",
    archetype: "connector",
    questions: [
      "I prioritize building networks and fostering connections; I believe in the power of relationships to drive collaborative success.",
    ],
  },
  {
    section: "Micro Heart",
    archetype: "coach",
    questions: [
      "I focus on the individual; I am attentive to personal development and emotional well-being in my approach to relationships.",
    ],
  },
  {
    section: "Macro What",
    archetype: "energizer",
    questions: [
      "I am passionate about motivating others towards a common goal; I energize and mobilize teams to achieve shared objectives.",
    ],
  },
  {
    section: "Micro What",
    archetype: "producer",
    questions: [
      "I am results-driven; I set specific goals and work diligently towards achieving them, often in a hands-on manner.",
    ],
  },
];

export function calculateInitialResults(answers: any) {
  // Initialize the results object with all archetypes set to 0
  const results = {
    explorer: 0,
    expert: 0,
    planner: 0,
    optimizer: 0,
    connector: 0,
    coach: 0,
    energizer: 0,
    producer: 0,
  };

  // Iterate over each answer
  Object.values(answers).forEach((answer: any) => {
    // Check if 'points' object exists and iterate over its keys (archetypes)
    if (answer.points) {
      Object.keys(answer.points).forEach((key) => {
        const archetype = key as Archetype;
        // Add the points to the corresponding archetype in the results object
        if (archetype in results) {
          results[archetype] += answer.points[archetype]; // Add points from the answer
        } else {
          console.warn(`Unrecognized archetype: ${archetype}`); // Warn about unrecognized archetypes
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
