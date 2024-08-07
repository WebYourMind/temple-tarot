export type ApiResponse = {
  message: string;
  error: string;
  data: any;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type UserProfile = {
  name: string;
  email: string;
  id?: string;
  address: Address;
  phone?: string;
  isSubscribed?: boolean;
};
