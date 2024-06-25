import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export const EXPIRY_TIME_ONE_HOUR = 60 * 60 * 1000; // 1 hour
export const EXPIRY_TIME_ONE_DAY = 60 * 60 * 1000 * 24; // 1 day
export const EXPIRY_TIME_ONE_WEEK = 60 * 60 * 1000 * 24 * 7; // 1 week

export const expiryTypes: { [key: string]: number } = {
  ONE_HOUR: EXPIRY_TIME_ONE_HOUR,
  ONE_DAY: EXPIRY_TIME_ONE_DAY,
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
  const regex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export function capitalizeFirstLetter(str: string) {
  // Check if the input string is not empty
  if (str.length === 0) {
    return str;
  }

  // Capitalize the first letter and concatenate it with the rest of the string
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export function getExpireDate(expiryType: keyof typeof expiryTypes) {
  const expiryTime = expiryTypes[expiryType];
  return new Date(new Date().getTime() + expiryTime);
}

export async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let result = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    result += decoder.decode(value);
  }

  reader.releaseLock();
  return result;
}

function toCamel(s) {
  return s.replace(/(_\w)/g, (m) => m[1].toUpperCase());
}

function isArray(a) {
  return Array.isArray(a);
}

function isObject(o) {
  return o === Object(o) && !isArray(o) && typeof o !== "function";
}

export function keysToCamel(o) {
  if (isObject(o)) {
    const n = {};
    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });
    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }

  return o;
}

function removeTrailingCommas(jsonString) {
  return jsonString.replace(/,\s*([\]}])/g, "$1");
}

export function parseJsonSafe(jsonString) {
  const cleanedJsonString = removeTrailingCommas(jsonString);
  try {
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error("Invalid JSON:", error);
    return null;
  }
}
