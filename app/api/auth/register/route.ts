import { NextRequest, NextResponse } from "next/server";

interface CustomBody {
  id: string;
  email: string;
  password: string;
  name?: string;
}

// acts as a mock api
export async function POST(request: NextRequest) {
  const user = (await request.json()) as CustomBody;

  if (user) {
    return NextResponse.json(
      {
        message: "User registered successfully.",
      },
      {
        status: 201,
      }
    );
  } else {
    return NextResponse.json(
      {
        error: "A user with the same email already exists!",
      },
      {
        status: 405,
      }
    );
  }
}
