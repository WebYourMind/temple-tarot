import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
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

  // Insert the new user into the database
  const { rows: newUsers } =
    await sql`INSERT INTO users (email, hashed_password, name) VALUES (${user.email}, ${hashedPassword}, ${user.name}) RETURNING *`;

  if (newUsers.length > 0) {
    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } else {
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
