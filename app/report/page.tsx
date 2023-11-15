import { Metadata } from "next";
import { sql } from "@vercel/postgres";
import Report from "./components/report";
import { getSession } from "lib/auth";
import { Score } from "lib/quiz";

export const metadata: Metadata = {
  title: "Merlin AI",
  description: "A guide for thinking based on natural systems.",
};

async function getThinkingStyle(userId: string) {
  try {
    // Attempt to retrieve thinking styles for the user.
    const { rows: scores } = await sql`
      SELECT * FROM scores
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    if (scores.length > 0) {
      return scores[0] as Score; // Return existing thread if found.
    }
  } catch (error) {
    console.error("An error occurred while getting user's thinking style:", error);
    throw error; // Re-throw the error to handle it in a calling function.
  }
}

async function getReport(userId: string) {
  try {
    // Attempt to retrieve thinking styles for the user.
    const { rows: reports } = await sql`
      SELECT reports.*, scores.explorer, scores.analyst, scores.designer, 
            scores.optimizer, scores.connector, scores.nurturer, 
            scores.energizer, scores.achiever
      FROM reports
      INNER JOIN scores ON reports.scores_id = scores.id
      WHERE reports.user_id = ${userId}
      ORDER BY reports.created_at DESC
      LIMIT 1;
    `;

    if (reports.length > 0) {
      return reports[0]; // Return existing thread if found.
    }
  } catch (error) {
    console.error("An error occurred while getting user's reports:", error);
    throw error; // Re-throw the error to handle it in a calling function.
  }
}

type ArchetypeValues = {
  explorer: string;
  analyst: string;
  designer: string;
  optimizer: string;
  connector: string;
  nurturer: string;
  energizer: string;
  achiever: string;
};

// Function to check if the archetype values match in scores and report objects
function haveMatchingArchetypeValues(scores: ArchetypeValues, report: ArchetypeValues): boolean {
  const archetypes: (keyof ArchetypeValues)[] = [
    "explorer",
    "analyst",
    "designer",
    "optimizer",
    "connector",
    "nurturer",
    "energizer",
    "achiever",
  ];

  for (const archetype of archetypes) {
    if (scores[archetype] !== report[archetype]) {
      return false;
    }
  }

  return true;
}

export default async function ReportPage() {
  const data = await getSession();
  let scores;
  let report;
  if (data && data.user) {
    try {
      scores = (await getThinkingStyle(data.user.id)) as any;
      report = (await getReport(data.user.id)) as any;

      if (!haveMatchingArchetypeValues(scores, report)) {
        report = undefined;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="md:pt-16">
      <Report scores={scores} report={report} />
    </div>
  );
}
