type Answer = {
  [key: string]: number;
};

export type Archetype =
  | "explorer"
  | "analyst"
  | "designer"
  | "optimizer"
  | "connector"
  | "nurturer"
  | "energizer"
  | "achiever";

export type Score = {
  [key in Archetype]: number;
};

type QuestionSection = {
  section: string;
  archetype: Archetype;
  questions: string[];
};

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
    archetype: "analyst",
    questions: [
      "I am drawn to data and analysis; I enjoy delving into the details to understand the mechanics of how things work.",
    ],
  },
  {
    section: "Macro Means",
    archetype: "designer",
    questions: [
      "I love to design systems and processes; I am focused on the efficiency and elegance of the overarching structure.",
    ],
  },
  {
    section: "Micro Means",
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
    archetype: "nurturer",
    questions: [
      "I focus on the individual; I am attentive to personal development and emotional well-being in my approach to relationships.",
    ],
  },
  {
    section: "Macro Ends",
    archetype: "energizer",
    questions: [
      "I am passionate about motivating others towards a common goal; I energize and mobilize teams to achieve shared objectives.",
    ],
  },
  {
    section: "Micro Ends",
    archetype: "achiever",
    questions: [
      "I am results-driven; I set specific goals and work diligently towards achieving them, often in a hands-on manner.",
    ],
  },
];

export function calculateScores(answers: Answer): Score {
  // Initialize scores for each archetype
  let scores: Score = {
    explorer: 0,
    analyst: 0,
    designer: 0,
    optimizer: 0,
    connector: 0,
    nurturer: 0,
    energizer: 0,
    achiever: 0,
  };

  const maxScorePerQuestion = 5;

  // Build questionToArchetypeMap and counters dynamically from the questions array
  questions.forEach((section) => {
    section.questions.forEach((question) => {
      scores[section.archetype] += answers[question] || 0; // Add score or zero if not answered
    });
  });

  // Normalize scores by dividing by the count of questions for each archetype
  Object.keys(scores).forEach((key) => {
    const archetype = key as Archetype;
    scores[archetype] = Number((scores[archetype] / maxScorePerQuestion).toFixed(2)); // Adjusted to 2 decimal places for consistency with database precision
  });

  // Return the normalized scores
  return scores;
}

// export const questions2 = [
//   {
//     section: "Analytical Thinking",
//     questions: [
//       "I enjoy working with numbers and statistical information.",
//       "I prefer structured and ordered information over open-ended tasks.",
//       "When making decisions, I rely more on data and facts than intuition.",
//     ],
//   },
//   {
//     section: "Creative Thinking",
//     questions: [
//       "I am drawn to tasks that involve a high degree of creativity and imagination.",
//       "I like to play with ideas and concepts and am not afraid to think outside the box.",
//       "I value aesthetics and the experience of beauty in my work and life.",
//     ],
//   },
//   {
//     section: "Practical Thinking",
//     questions: [
//       "I tend to focus on the practicality and utility of ideas.",
//       "I am good at implementing solutions and following through with plans.",
//       "I often look for ways to improve processes and efficiency.",
//     ],
//   },
//   {
//     section: "Reflective Thinking",
//     questions: [
//       "I spend time reflecting on my thoughts and experiences to gain insights.",
//       "I value personal growth and understanding as outcomes of learning.",
//       "I am introspective and like to consider multiple perspectives on an issue.",
//     ],
//   },
//   {
//     section: "Interpersonal Thinking",
//     questions: [
//       "I value social interactions and learn best when I can discuss ideas with others.",
//       "I am sensitive to other people's feelings and perspectives.",
//       "I often lead group discussions or projects.",
//     ],
//   },
//   {
//     section: "Logical Reasoning",
//     questions: [
//       "I enjoy solving puzzles and brainteasers.",
//       "My thinking is sequential and follows a logical path.",
//       "I am good at identifying patterns and making logical connections.",
//     ],
//   },
// ];

// export function calculateScores2(answers: any) {
//   // Initialize scores for each thinking style
//   const scores = {
//     analytical: 0,
//     creative: 0,
//     practical: 0,
//     reflective: 0,
//     interpersonal: 0,
//     logical: 0,
//   } as any;

//   // Map each question to its corresponding thinking style
//   const questionToStyleMap = {
//     "I enjoy working with numbers and statistical information.": "analytical",
//     "I prefer structured and ordered information over open-ended tasks.": "analytical",
//     "When making decisions, I rely more on data and facts than intuition.": "analytical",
//     "I am drawn to tasks that involve a high degree of creativity and imagination.": "creative",
//     "I like to play with ideas and concepts and am not afraid to think outside the box.": "creative",
//     "I value aesthetics and the experience of beauty in my work and life.": "creative",
//     "I tend to focus on the practicality and utility of ideas.": "practical",
//     "I am good at implementing solutions and following through with plans.": "practical",
//     "I often look for ways to improve processes and efficiency.": "practical",
//     "I spend time reflecting on my thoughts and experiences to gain insights.": "reflective",
//     "I value personal growth and understanding as outcomes of learning.": "reflective",
//     "I am introspective and like to consider multiple perspectives on an issue.": "reflective",
//     "I value social interactions and learn best when I can discuss ideas with others.": "interpersonal",
//     "I am sensitive to other people's feelings and perspectives.": "interpersonal",
//     "I often lead group discussions or projects.": "interpersonal",
//     "I enjoy solving puzzles and brainteasers.": "logical",
//     "My thinking is sequential and follows a logical path.": "logical",
//     "I am good at identifying patterns and making logical connections.": "logical",
//   } as any;

//   // Iterate over each answer to calculate the score for each thinking style
//   for (const [question, answerScore] of Object.entries(answers)) {
//     const style = questionToStyleMap[question];
//     if (style) {
//       scores[style] += answerScore;
//     }
//   }

//   for (const style in scores) {
//     scores[style] = Number(scores[style] / 15).toFixed(2); // Normalize each style score
//   }

//   // Return the final scores
//   return scores;
// }
