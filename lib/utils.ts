import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { ArchetypeValues, ThinkingStyle } from "./types";

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
export function haveMatchingArchetypeValues(scores: ArchetypeValues, report: ArchetypeValues): boolean {
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

export function getRelativePercentages({
  explorer,
  analyst,
  designer,
  optimizer,
  connector,
  nurturer,
  energizer,
  achiever,
}: ArchetypeValues) {
  // Convert string values to numbers and calculate the total score
  const totalScore = [explorer, analyst, designer, optimizer, connector, nurturer, energizer, achiever]
    .map((score) => parseFloat(score))
    .reduce((sum, current) => sum + current, 0);

  // Calculate relative percentages
  const relativePercentages = [explorer, analyst, designer, optimizer, connector, nurturer, energizer, achiever].map(
    (score) => parseFloat(((parseFloat(score) / totalScore) * 100).toFixed(1))
  );

  return relativePercentages;
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
  analyst,
  designer,
  optimizer,
  connector,
  nurturer,
  energizer,
  achiever,
}: ArchetypeValues) {
  const scores = {
    explorer,
    analyst,
    designer,
    optimizer,
    connector,
    nurturer,
    energizer,
    achiever,
  };
  const dominantStyle = (Object.keys(scores) as (keyof typeof scores)[]).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );
  const capitalizedStyle = dominantStyle[0].toUpperCase() + dominantStyle.slice(1);
  return capitalizedStyle as ThinkingStyle;
}
