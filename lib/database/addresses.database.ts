import { QueryResultRow, sql } from "@vercel/postgres";

export const updateUserAddress = async (
  street: string,
  city: string,
  state: string,
  postalCode: string,
  country: string,
  address_id: number
) => {
  try {
    await sql`UPDATE addresses SET street = ${street}, city = ${city}, state = ${state}, postal_code = ${postalCode}, country = ${country} WHERE id = ${address_id}`;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const insertNewAddress = async (
  street: string,
  city: string,
  state: string,
  postalCode: string,
  country: string
) => {
  try {
    const { rows: newAddress } =
      await sql`INSERT INTO addresses (street, city, state, postal_code, country) VALUES (${street}, ${city}, ${state}, ${postalCode}, ${country}) RETURNING id`;
    return newAddress[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteAddressById = async ( address_id: number) => {
  try {
    await sql`DELETE FROM addresses WHERE id = ${address_id}`;
  } catch (error) {
    console.log(error);
    return null;
  }
};
