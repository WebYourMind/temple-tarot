import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";

interface RegisterUser {
  email: string;
  password: string;
  name?: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = (await request.json()) as RegisterUser;

    // Validation
    if (!user.email || !user.password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Check for existing users with the same email
    const { rows: existingUsers } = await sql`SELECT * FROM users WHERE email = ${user.email}`;

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "A user with the same email already exists!" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // Insert the new user into the database
    const { rows: newUsers } =
      await sql`INSERT INTO users (email, hashed_password, name) VALUES (${user.email}, ${hashedPassword}, ${user.name}) RETURNING *`;

    if (!newUsers.length) {
      return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
    }

    const newUser = newUsers[0];
    const userId = newUser.id;

    if (userId) {
      const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000 * 24 * 7).toISOString(); // one week

      await sql`INSERT INTO verification_tokens (identifier, token, expires) VALUES (${user.email}, ${verifyToken}, ${expirationTime})`;

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

      return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
    } else {
      return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
    }
  } catch (error) {
    console.error("Error during registration:", error);
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
