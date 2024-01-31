import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { ThinkingStyle, UserProfile } from "./types";
import { Score } from "./quiz";
import { ArchetypeKey } from "app/quiz/components/tie-breaker";

export const EXPIRY_TIME_ONE_HOUR = 60 * 60 * 1000; // 1 hour

export const EXPIRY_TIME_ONE_WEEK = 60 * 60 * 1000 * 24 * 7; // 1 week

export const expiryTypes: { [key: string]: number } = {
  ONE_HOUR: EXPIRY_TIME_ONE_HOUR,
  ONE_WEEK: EXPIRY_TIME_ONE_WEEK,
};

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

export function countUsersWithStyles(users: UserProfile[]) {
  const usersWithDominantStyle = users.filter((user) => user.dominantStyle && user.dominantStyle.trim() !== "");

  return usersWithDominantStyle;
}

export function getAccumulatedStyles(teamMembers: UserProfile[]) {
  const styleCounts = teamMembers.reduce((acc: any, member: UserProfile) => {
    Object.keys(member.scores as Score).forEach((key: string) => {
      const capKey = capitalizeFirstLetter(key);
      acc[capKey] = (acc[capKey] || 0) + (member.scores as Score)[key as ArchetypeKey];
    });

    return acc;
  }, {});
  const data = Object.keys(styleCounts).map((key) => ({ name: key, value: styleCounts[key] }));
  return data;
}

interface DataItem {
  name: string;
  value: number;
}

export function convertToRelativePercentages(data: DataItem[]) {
  // Calculate the total sum of all 'value' fields
  const total = data.reduce((sum: number, item: DataItem) => sum + item.value, 0);

  // Convert each 'value' to a percentage of the total
  const percentages = data.map((item) => ({
    ...item,
    value: ((item.value / total) * 100).toFixed(2) + "%", // Convert to percentage and format as a string with 2 decimal places
  }));

  return percentages;
}

export const sanitizeTeamScores = (teamScores: any) => {
  const users = [];
  if (teamScores !== null) {
    for (let i = 0; i < teamScores.length; i++) {
      const row = teamScores[i];

      const score = {
        explore: parseFloat(row.explore),
        design: parseFloat(row.design),
        energize: parseFloat(row.energize),
        connect: parseFloat(row.connect),
        analyze: parseFloat(row.analyze),
        optimize: parseFloat(row.optimize),
        achieve: parseFloat(row.achieve),
        nurture: parseFloat(row.nurture),
      };

      const dominantStyle = getDominantStyle(score);
      users.push({
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        phone: row.user_phone,
        role: row.user_role,
        dominantStyle: dominantStyle,
        scores: score,
      });
    }
  }
  return users;
};

export const sanitizeTeamData = (teamScores: any, team: any) => {
  const users = sanitizeTeamScores(teamScores);

  const teamData = {
    id: team.id,
    name: team.name,
    description: team.description,
    adminId: team.admin_id,
    image: team.image,
    inviteToken: team.invite_token,
    users: users,
  };
  return teamData;
};

export function getExpireDate(expiryType: keyof typeof expiryTypes) {
  const expiryTime = expiryTypes[expiryType];
  return new Date(new Date().getTime() + expiryTime);
}
