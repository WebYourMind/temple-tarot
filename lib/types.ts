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
  analyst: string;
  designer: string;
  optimizer: string;
  connector: string;
  nurturer: string;
  energizer: string;
  achiever: string;
};

export type ThinkingStyle =
  | "Explorer"
  | "Analyst"
  | "Designer"
  | "Optimizer"
  | "Connector"
  | "Nurturer"
  | "Energizer"
  | "Achiever";

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
