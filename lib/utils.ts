import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { ThinkingStyle } from "./types";
import { Score } from "./quiz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7); // 7-character random string

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

// Function to check if the archetype values match in scores and report objects
export function haveMatchingArchetypeValues(scores: Score, report: Score): boolean {
  const archetypes: (keyof Score)[] = [
    "explorer",
    "expert",
    "planner",
    "optimizer",
    "connector",
    "coach",
    "energizer",
    "producer",
  ];

  for (const archetype of archetypes) {
    if (scores[archetype] !== report[archetype]) {
      return false;
    }
  }

  return true;
}

export function getRelativePercentages({
  explorer,
  expert,
  planner,
  optimizer,
  connector,
  coach,
  energizer,
  producer,
}: Score) {
  const scores = [explorer, expert, planner, optimizer, connector, coach, energizer, producer];

  // Calculate the total score
  const totalScore = scores.reduce((sum, current) => sum + current, 0);

  // Check if the total score is zero to avoid division by zero
  if (totalScore === 0) {
    // If totalScore is 0, return an array with 0s or handle it as needed
    return scores.map(() => 0);
  }

  // Calculate relative percentages
  const relativePercentages = scores.map((score) => parseFloat(((score / totalScore) * 100).toFixed(1)));

  return relativePercentages;
}

export function getSortedStyles(scores: number[]) {
  const styleNames = ["Explorer", "Expert", "Planner", "Optimizer", "Connector", "Coach", "Energizer", "Producer"];
  const sortedStyles = styleNames
    .map((style, index) => ({ style, score: scores[index] }))
    .sort((a, b) => b.score - a.score) // Sorting in descending order of scores
    .map(({ style, score }) => `- ${style}: ${score}%`);
  return sortedStyles;
}

export function isPasswordComplex(password: string) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
}

export function isValidPhoneNumber(phoneNumber: string) {
  // Remove common characters (spaces, dashes, parentheses)
  const cleanedNumber = phoneNumber.replace(/[\s-()]/g, "");

  // Check if the number contains only digits (and optional leading +)
  const regex = /^\+?\d{7,15}$/;
  return regex.test(cleanedNumber);
}

export function isValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export function getDominantStyle({
  explorer,
  expert,
  planner,
  optimizer,
  connector,
  coach,
  energizer,
  producer,
}: Score) {
  const scores = {
    explorer,
    expert,
    planner,
    optimizer,
    connector,
    coach,
    energizer,
    producer,
  };
  // Check if any score is null
  const hasNullScore = Object.values(scores).some((score) => score === null);
  if (hasNullScore) {
    return null;
  }
  const dominantStyle = (Object.keys(scores) as (keyof typeof scores)[]).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );
  const capitalizedStyle = dominantStyle[0].toUpperCase() + dominantStyle.slice(1);
  return capitalizedStyle as ThinkingStyle;
}
