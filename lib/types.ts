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
  explorer: string;
  expert: string;
  planner: string;
  optimizer: string;
  connector: string;
  coach: string;
  energizer: string;
  producer: string;
};

export type ThinkingStyle =
  | "Explorer"
  | "Expert"
  | "Planner"
  | "Optimizer"
  | "Connector"
  | "Coach"
  | "Energizer"
  | "Producer";

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
