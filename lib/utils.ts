import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { ThinkingStyle, UserProfile } from "./types";
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
    "explore",
    "analyze",
    "design",
    "optimize",
    "connect",
    "nurture",
    "energize",
    "achieve",
  ];

  for (const archetype of archetypes) {
    if (scores[archetype] !== report[archetype]) {
      return false;
    }
  }

  return true;
}

export function getScoresArray({ explore, analyze, design, optimize, connect, nurture, energize, achieve }: Score) {
  return [explore, analyze, design, optimize, connect, nurture, energize, achieve];
}

export function getSortedStyles(scores: number[]) {
  const styleNames = ["Explore", "Analyze", "Design", "Optimize", "Connect", "Nurture", "Energize", "Achieve"];
  const sortedStyles = styleNames
    .map((style, index) => ({ style, score: scores[index] }))
    .sort((a, b) => b.score - a.score) // Sorting in descending order of scores
    .map(({ style, score }) => `- ${style}: ${score}/100`);
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

export function getDominantStyle({ explore, analyze, design, optimize, connect, nurture, energize, achieve }: Score) {
  const scores = {
    explore,
    analyze,
    design,
    optimize,
    connect,
    nurture,
    energize,
    achieve,
  };
  // Check if any score is null
  const hasNullScore = Object.values(scores).some((score) => score === null || Number.isNaN(score));
  if (hasNullScore) {
    return null;
  }
  const dominantStyle = (Object.keys(scores) as (keyof typeof scores)[]).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );
  const capitalizedStyle = dominantStyle[0].toUpperCase() + dominantStyle.slice(1);
  return capitalizedStyle as ThinkingStyle;
}

export function capitalizeFirstLetter(str: string) {
  // Check if the input string is not empty
  if (str.length === 0) {
    return str;
  }

  // Capitalize the first letter and concatenate it with the rest of the string
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function minUsersWithStyles(users: UserProfile[]) {
  const usersWithDominantStyle = users.filter((user) => user.dominantStyle && user.dominantStyle.trim() !== "");

  const hasAtLeastThreeUsersWithDominantStyle = usersWithDominantStyle.length >= 3;

  return hasAtLeastThreeUsersWithDominantStyle;
}
