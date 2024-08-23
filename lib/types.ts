export type AddressType = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type UserProfileType = {
  name: string;
  email: string;
  id?: string;
  address: AddressType;
  phone?: string;
  isSubscribed?: boolean;
};

export type SpreadType = {
  numberOfCards: number;
  description: string;
  value: "single_card" | "three_card";
  name: string;
  cardMeanings: string[];
};

export type SelectedCardType = {
  cardName: string;
  orientation: string;
  imageUrl?: string;
  detail?: {};
  readingTips?: string;
  uprightGuidance?: string;
  reversedGuidance?: string;
};

export type DeckType = { promptName: string; value: string; name: string };

export interface CardInReading {
  id?: number;
  readingId?: number;
  cardName: string;
  orientation: string;
  position: number;
  imageUrl?: string;
  detail?: {};
  readingTips?: string;
  uprightGuidance?: string;
  reversedGuidance?: string;
  deck?: string;
}

// Interface for a Reading
export type ReadingType = {
  id?: string;
  userId?: string;
  userQuery: string;
  spread?: SpreadType;
  aiInterpretation?: string;
  createdAt?: Date;
  cards?: CardInReading[];
};

export interface TarotSessionType {
  id: string;
  userId: string;
  createdAt: Date;
  readings: ReadingType[];
}
