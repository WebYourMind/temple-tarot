import { sql } from "@vercel/postgres";
import crypto from "crypto";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import { NextRequest, NextResponse } from "next/server";

interface CustomBody {
  email: string;
  password: string;
  name?: string;
}

export async function POST(request: NextRequest) {
  const user = (await request.json()) as CustomBody;

  // Validation
  if (!user.email || !user.password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // Check for existing users with the same email
  const { rows: existingUsers } = await sql`SELECT * FROM users WHERE email = ${user.email}`;

  if (existingUsers.length > 0) {
    return NextResponse.json({ error: "A user with the same email already exists!" }, { status: 409 });
  }

  // Hashing the password
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");

  // Insert the new user into the database
  const { rows: newUsers } =
    await sql`INSERT INTO users (email, hashed_password, name) VALUES (${user.email}, ${hashedPassword}, ${user.name}) RETURNING *`;

  const userId = newUsers[0].id;

  if (userId) {
    await sql`INSERT INTO verification_tokens (identifier, token, expires) VALUES (${
      user.email
    }, ${verifyToken}, ${new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()})`;
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
    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } else {
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
