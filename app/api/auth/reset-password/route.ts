import { NextRequest, NextResponse } from "next/server";

interface CustomBody {
  token: string;
  password: string;
}

// Mocks the /reset-password endpoint
export async function POST(request: NextRequest) {
  const { token, password } = (await request.json()) as CustomBody;

  if (token && password) {
    // Assuming that the password is reset successfully.
    return NextResponse.json({
      message: "Password reset successfully.",
    });
  } else {
    return NextResponse.json(
      {
        error: "Invalid token or password.",
      },
      {
        status: 400,
      }
    );
  }
}
