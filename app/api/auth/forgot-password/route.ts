import { NextRequest, NextResponse } from "next/server";

interface CustomBody {
  email: string;
}

// Mocks the /forgot-password endpoint
export async function POST(request: NextRequest) {
  const { email } = (await request.json()) as CustomBody;

  if (email) {
    // Assuming that a reset email is sent successfully.
    return NextResponse.json({
      message: "Password reset email sent successfully 🎉",
    });
  } else {
    return NextResponse.json(
      {
        error: "Invalid email address.",
      },
      {
        status: 400,
      }
    );
  }
}
