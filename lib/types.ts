import { Score } from "./quiz";

export type ApiResponse = {
  message: string;
  error: string;
  data: any;
};

export type ReportType = string | undefined;

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type ArchetypeValues = {
  explore: string;
  analyze: string;
  design: string;
  optimize: string;
  connect: string;
  nurture: string;
  energize: string;
  achieve: string;
};

export type ThinkingStyle =
  | "Explore"
  | "Analyze"
  | "Design"
  | "Optimize"
  | "Connect"
  | "Nurture"
  | "Energize"
  | "Achieve";

export type UserProfile = {
  name: string;
  email: string;
  id?: string;
  address: Address;
  phone?: string;
  role?: string;
  teamId?: string;
  scores?: Score;
  dominantStyle?: ThinkingStyle;
};

export type TeamForm = {
  name: string;
  description: string;
};

export type Team = {
  id: string;
  inviteToken: string;
  adminId: string;
  users?: UserProfile[];
} & TeamForm;
