import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { UserProfile } from "lib/types";
import { getSession } from "lib/auth";
import {
  getAddressById,
  getUserByEmail,
  getUserById,
  getUserWithAdressById,
  removeUserAddressId,
  updateUserById,
  updateUserId,
} from "lib/database/user.database";
import { deleteAddressById, insertNewAddress, updateUserAddress } from "lib/database/addresses.database";
import { insertVerificationToken } from "lib/database/verificationTokens.database";
import { deleteProfileById } from "lib/database/profile.database";

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is not null or undefined
    if (!userId) {
      return NextResponse.json({ error: "The user ID must be provided." }, { status: 400 });
    }

    const { user } = (await request.json()) as { user: UserProfile };

    // Validate email and name
    if (!user.email || !user.email.includes("@")) {
      return NextResponse.json({ error: "Invalid email provided." }, { status: 400 });
    }
    if (!user.name || user.name.trim().length === 0) {
      return NextResponse.json({ error: "Invalid name provided." }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await getUserById(parseInt(userId));
    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const { street, city, state, postalCode, country } = user?.address;
    const isAddressProvided = street || city || state || postalCode || country;

    const existingAddress = await getAddressById(parseInt(userId));

    if (!existingAddress) {
      return NextResponse.json({ error: "Address does not exist" }, { status: 400 });
    }

    if (isAddressProvided) {
      if (existingAddress?.address_id) {
        // Update existing address
        await updateUserAddress(street, city, state, postalCode, country, existingAddress?.address_id);
      } else {
        // Insert new address and update user record with new address_id
        const newAddress = await insertNewAddress(street, city, state, postalCode, country);
        if (!newAddress) {
          return NextResponse.json({ error: "Failed to insert address." }, { status: 400 });
        }
        await updateUserId(parseInt(newAddress?.id), parseInt(userId));
      }
      // If there is an address stored but the user intentionally deletes their address fields
    } else if (existingAddress && existingAddress?.address_id) {
      // Delete the existing address record
      await deleteAddressById(existingAddress?.address_id);
      // Set the user's address_id to NULL
      await removeUserAddressId(parseInt(userId));
    }

    let successMessage = "Profile updated successfully.";

    if (existingUser?.email !== user?.email) {
      //get user infromation by email
      const existingEmail = await getUserByEmail(user?.email);

      if (!existingEmail) {
        const verifyToken = crypto.randomBytes(32).toString("hex");
        //verification token from database
        const isInsertedVerificationToken = await insertVerificationToken(user.email, verifyToken);
        if (!isInsertedVerificationToken) {
          return NextResponse.json({ error: "Token Insertion failed" }, { status: 500 });
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
        const msg = {
          to: user.email,
          from: process.env.SENDGRID_EMAIL_ADDRESS,
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

    //update user information in database
    const users = await updateUserById(user.email, user.name, user.phone, parseInt(userId));
    if (!users) {
      return NextResponse.json({ error: "user update failed" }, { status: 500 });
    }
    return NextResponse.json({ message: successMessage, updatedUser: users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = (await getSession())?.user.id;

    // Check if userId is not null or undefined
    if (!userId) {
      throw new Error("The user ID must be provided.");
    }

    //delete profile from all tables in database
    const res = await deleteProfileById(parseInt(userId));
    if (!res) {
      return NextResponse.json(
        {
          message: "Failed to delete profile",
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      {
        message: "User and associated data deleted successfully.",
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is not null or undefined
    if (!userId) {
      throw new Error("The user ID must be provided.");
    }

    //get user data with address from database
    const user = await getUserWithAdressById(parseInt(userId));
    // Check if we got a result back
    if (!user) {
      return NextResponse.json(
        {
          error: "No user found for the given user ID.",
        },
        {
          status: 404,
        }
      );
    }

    const hasAddress =
      user.street !== null ||
      user.city !== null ||
      user.state !== null ||
      user.postal_code !== null ||
      user.country !== null;

    const userWithAddress = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      teamId: user.team_id,
      address: hasAddress
        ? {
            street: user.street,
            city: user.city,
            state: user.state,
            postalCode: user.postal_code,
            country: user.country,
          }
        : null,
    };

    return NextResponse.json(
      {
        message: "User info retrieved successfully.",
        user: userWithAddress,
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
