export type McqAnswer = {
  [key: string]: Choice;
};

export type Archetype = "explore" | "analyze" | "plan" | "optimize" | "connect" | "nurture" | "energize" | "achieve";

export type Score = {
  [key in Archetype]: number;
};

type Points = {
  [key in Archetype]?: number;
};

export type Choice = {
  option: string;
  points?: Points;
  styles?: Archetype[];
};

export type MCQQuestion = {
  type: "mcq";
  statement: string;
  choices: Choice[];
};

export type RankingQuestion = {
  type: "ranking";
  statement: string;
  choices: Choice[];
};

export type RatingQuestion = {
  type: "rating";
  statement: string;
  archetype: Archetype;
};

export type QuizQuestion = MCQQuestion | RankingQuestion | RatingQuestion;

export const quizQuestions: QuizQuestion[] = [
  {
    type: "ranking",
    statement:
      "As you get ready for your day, what are you most likely to be thinking about? (Please drag to rank from top to bottom, with the most likely at the top)",
    choices: [
      { option: "A GOAL to energize or achieve", styles: ["energize", "achieve"] },
      { option: "A PROCESS to design or optimize", styles: ["plan", "optimize"] },
      { option: "A RELATIONSHIP to connect or nurture", styles: ["connect", "nurture"] },
      { option: "An IDEA to explore or analyze", styles: ["explore", "analyze"] },
    ],
  },
  {
    type: "mcq",
    statement: "Which statement best applies to how you think?",
    choices: [
      {
        option: "I’m a big picture person. I am fine for others to work out the details.",
        points: {
          explore: 5,
          plan: 5,
          connect: 5,
          energize: 5,
        },
      },
      {
        option: "I like to have the context, then dig into the details.",
        points: {
          explore: 3,
          plan: 3,
          connect: 3,
          energize: 3,
          optimize: 2,
          analyze: 2,
          nurture: 2,
          achieve: 2,
        },
      },
      {
        option: "I like to start with specifics, then zoom out to get the big picture.",
        points: {
          explore: 2,
          plan: 2,
          connect: 2,
          energize: 2,
          optimize: 3,
          analyze: 3,
          nurture: 3,
          achieve: 3,
        },
      },
      {
        option: "I’m a detail person. I am fine when others set the strategy and direction.",
        points: {
          optimize: 5,
          analyze: 5,
          nurture: 5,
          achieve: 5,
        },
      },
    ],
  },
  {
    type: "mcq",
    statement: "When making decisions...",
    choices: [
      {
        option: "I tend to focus on the facts, being as objective as possible.",
        points: {
          explore: 10,
          analyze: 10,
        },
      },
      {
        option: "I look at the facts first, but make sure I will feel good about the outcome.",
        points: {
          explore: 6,
          analyze: 6,
          connect: 4,
          nurture: 4,
        },
      },
      {
        option: "I sense what feels right, then evaluate how well the facts support it.",
        points: {
          explore: 4,
          analyze: 4,
          connect: 6,
          nurture: 6,
        },
      },
      {
        option: "I tend to focus on my feelings and intuition, even if it goes against the facts.",
        points: {
          connect: 10,
          nurture: 10,
        },
      },
    ],
  },
  {
    type: "mcq",
    statement: "When starting a project...",
    choices: [
      {
        option:
          "I tend to focus on WHAT needs to be done, the goals and actions, to ensure we are energized, aligned and in motion.",
        points: {
          achieve: 10,
          energize: 10,
        },
      },
      {
        option:
          "I tend to focus on HOW we get there, the plans and process, to ensure we are efficient, organized and productive.",
        points: {
          plan: 10,
          optimize: 10,
        },
      },
      {
        option: "I look at both equally.",
        points: {
          plan: 5,
          energize: 5,
          optimize: 5,
          achieve: 5,
        },
      },
    ],
  },
  {
    type: "rating",
    archetype: "explore",
    statement: "Explore creative solutions to a problem.",
  },
  {
    type: "rating",
    archetype: "connect",
    statement: "Make a connection to someone you know.",
  },
  {
    type: "rating",
    archetype: "energize",
    statement: "Mobilize resources around an initiative.",
  },
  {
    type: "rating",
    archetype: "plan",
    statement: "Design a process to achieve a goal.",
  },
  {
    type: "rating",
    archetype: "analyze",
    statement: "Analyze data to generate insights.",
  },
  {
    type: "rating",
    archetype: "optimize",
    statement: "Improve a process to save time or money.",
  },
  {
    type: "rating",
    archetype: "nurture",
    statement: "Get advice on a personal problem.",
  },
  {
    type: "rating",
    archetype: "achieve",
    statement: "Make a list of action items.",
  },
  {
    type: "mcq",
    statement: "Are you more likely to get bored or frustrated in a meeting because it is...",
    choices: [
      {
        option: "Too conceptual and in the clouds.",
        points: {
          explore: 5,
          connect: 5,
          energize: 5,
          plan: 5,
        },
      },
      {
        option: "Too detailed and in the weeds.",
        points: {
          analyze: 5,
          nurture: 5,
          optimize: 5,
          achieve: 5,
        },
      },
      {
        option: "Both.",
        points: {
          explore: 2,
          connect: 2,
          energize: 2,
          plan: 2,
          analyze: 2,
          nurture: 2,
          optimize: 2,
          achieve: 2,
        },
      },
      {
        option: "Neither.",
        points: {
          plan: 0,
        },
      },
    ],
  },
  {
    type: "mcq",
    statement: "Are you more likely to pay attention in a meeting to...",
    choices: [
      {
        option: "The ideas being discussed and the related facts and data.",
        points: {
          explore: 10,
          analyze: 10,
        },
      },
      {
        option: "The people and their relationships, behavior and feelings.",
        points: {
          connect: 10,
          nurture: 10,
        },
      },
      {
        option: "Both.",
        points: {
          explore: 5,
          analyze: 5,
          connect: 5,
          nurture: 5,
        },
      },
      {
        option: "Neither.",
        points: {
          explore: 0,
        },
      },
    ],
  },
];

const resultsInit = {
  explore: 0,
  analyze: 0,
  plan: 0,
  optimize: 0,
  connect: 0,
  nurture: 0,
  energize: 0,
  achieve: 0,
};

export function calculateMcqResults(answers: McqAnswer[]) {
  const results = { ...resultsInit };

  // Iterate over each answer
  Object.values(answers).forEach((answer) => {
    if (answer.points) {
      Object.entries(answer.points).forEach(([archetype, points]) => {
        if (archetype in results && typeof points === "number") {
          results[archetype as Archetype] += points;
        } else {
          console.warn(`Unrecognized archetype: ${archetype}`);
        }
      });
    }
  });
  return results;
}

export function calculateRankingResults(rankAnswers: Choice[]) {
  const results: Score = { ...resultsInit };
  // Points for each position [first, second, third, ...]
  const pointsForPosition = [5, 3, 2, 0]; // Extend this array if you have more positions

  rankAnswers.forEach((item, index) => {
    const points = pointsForPosition[index] || 0; // Default to 0 if index is out of bounds
    (item.styles as Archetype[]).forEach((style) => {
      results[style] = points;
    });
  });

  return results;
}

// Function to combine scores
export const combineScores = (scores: Score[]): Score => {
  const combinedScores: Score = { ...resultsInit };

  scores.forEach((score) => {
    Object.keys(score).forEach((key) => {
      const archetype = key as Archetype;
      if (!combinedScores[archetype]) {
        combinedScores[archetype] = 0;
      }
      combinedScores[archetype] += score[archetype];
    });
  });

  return combinedScores;
};

export const calcScoresOver100 = (score: Score): Score => {
  const scoresOver100: Score = { ...resultsInit };

  Object.keys(score).forEach((key) => {
    const archetype = key as Archetype;
    scoresOver100[archetype] = parseFloat(((score[archetype] / 40) * 100).toFixed(0));
  });

  return scoresOver100;
};
