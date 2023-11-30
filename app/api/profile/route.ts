import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { UserProfile } from "lib/types";

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is not null or undefined
    if (!userId) {
      return NextResponse.json({ error: "The user ID must be provided." }, { status: 400 });
    }

    const { user } = (await request.json()) as {
      user: UserProfile;
    };

    const { street, city, state, postalCode, country } = user.address;
    const isAddressProvided = street || city || state || postalCode || country;
    const { rows: existingAddress } = await sql`SELECT address_id FROM users WHERE id = ${userId}`;

    if (isAddressProvided) {
      if (existingAddress[0].address_id) {
        // Update existing address
        await sql`UPDATE addresses SET street = ${street}, city = ${city}, state = ${state}, postal_code = ${postalCode}, country = ${country} WHERE id = ${existingAddress[0].address_id}`;
      } else {
        // Insert new address and update user record with new address_id
        const { rows: newAddress } =
          await sql`INSERT INTO addresses (street, city, state, postal_code, country) VALUES (${street}, ${city}, ${state}, ${postalCode}, ${country}) RETURNING id`;
        await sql`UPDATE users SET address_id = ${newAddress[0].id} WHERE id = ${userId}`;
      }
      // If there is an address stored but the user intentionally deletes their address fields
    } else if (existingAddress[0] && existingAddress[0].address_id) {
      // Delete the existing address record
      await sql`DELETE FROM addresses WHERE id = ${existingAddress[0].address_id}`;
      // Set the user's address_id to NULL
      await sql`UPDATE users SET address_id = NULL WHERE id = ${userId}`;
    }

    // Validate email and name
    if (!user.email || !user.email.includes("@")) {
      return NextResponse.json({ error: "Invalid email provided." }, { status: 400 });
    }
    if (!user.name || user.name.trim().length === 0) {
      return NextResponse.json({ error: "Invalid name provided." }, { status: 400 });
    }

    // Check if user exists
    const { rows: existingUser } = await sql`SELECT * FROM users WHERE id = ${userId}`;
    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    let successMessage = "Profile updated successfully.";

    if (existingUser[0].email !== user.email) {
      const { rows: existingEmail } = await sql`SELECT * FROM users WHERE email = ${user.email}`;
      if (existingEmail.length === 0) {
        const verifyToken = crypto.randomBytes(32).toString("hex");
        const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000 * 24 * 7).toISOString(); // one week
        await sql`INSERT INTO verification_tokens (identifier, token, expires) VALUES (${user.email}, ${verifyToken}, ${expirationTime})`;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
        const msg = {
          to: user.email,
          from: "adam@webyourmind.com", // TODO: change later
          template_id: process.env.SENDGRID_VERIFY,
          personalizations: [
            {
              to: { email: user.email },
              dynamic_template_data: {
                name: user.name,
                verifyUrl: `${process.env.NEXTAUTH_URL}/verify-email?token=${verifyToken}`,
              },
            },
          ],
        };
        await sgMail.send(msg as any);

        successMessage += " Please check your inbox to verify your new email.";
      } else {
        return NextResponse.json({ error: "A user with the same email already exists!" }, { status: 409 });
      }
    }

    const { rows: users } =
      await sql`UPDATE users SET email = ${user.email}, name = ${user.name}, phone = ${user.phone} WHERE id = ${userId} RETURNING *`;

    return NextResponse.json({ message: successMessage, updatedUser: users[0] }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is not null or undefined
    if (!userId) {
      throw new Error("The user ID must be provided.");
    }

    // Query to select the latest scores row for the given user ID
    const { rows: users } = await sql`
      SELECT * 
      FROM users
      WHERE user_id = ${userId}
      LIMIT 1;
    `;

    // Check if we got a result back
    if (users.length === 0) {
      return NextResponse.json(
        {
          error: "No user found for the given user ID.",
        },
        {
          status: 404,
        }
      );
    }

    // Return the latest scores row
    return NextResponse.json(
      {
        message: "User info retrieved successfully.",
        scores: users[0],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // Return an error response
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      {
        status: 500,
      }
    );
  }
}
