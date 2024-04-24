import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
import { RegisterUser } from "../../../../lib/AppInterface";
import { insertVerificationToken } from "../../../../lib/database/verificationTokens.database";
import { getUserByEmail, insertUser } from "../../../../lib/database/user.database";

export async function POST(request: NextRequest) {
  try {
    const user = (await request.json()) as RegisterUser;

    // Validation
    if (!user || !user.email || !user.password || !user.name) {
      return NextResponse.json({ error: "name,email and password are required." }, { status: 400 });
    }

    // Check for existing users with the same email
    const existingUsers = await getUserByEmail(user.email);

    if (existingUsers) {
      return NextResponse.json({ error: "A user with the same email already exists!" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // Insert the new user into the database
    const newUser = await insertUser(user.name, user.email, hashedPassword);

    if (!newUser || !newUser.id) {
      return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
    }

    const isVerificationInserted = await insertVerificationToken(user.email, verifyToken);

    if (!isVerificationInserted) {
      return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
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

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}
