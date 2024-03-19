import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import { getUserByEmail } from "../../../../../lib/database/user.database";
import { insertPasswordResetToken } from "../../../../../lib/database/passwordResetTokens.database";

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email: string };

    if (!email) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Check for existing user
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "No user with this email exists!" }, { status: 409 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const isInserted = await insertPasswordResetToken(user.id, resetToken);

    if (!isInserted) {
      return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const msg = {
      to: user.email,
      from: process.env.SENDGRID_EMAIL_ADDRESS,
      template_id: process.env.SENDGRID_RESET_PASSWORD,
      personalizations: [
        {
          to: { email: user.email },
          dynamic_template_data: {
            resetPasswordUrl: `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`,
          },
        },
      ],
    };
    await sgMail.send(msg as any);

    return NextResponse.json(
      {
        message: "Password reset email sent successfully 🎉",
      },
      { status: 200 }
    );
  } catch (error) {
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
