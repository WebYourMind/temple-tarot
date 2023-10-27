import { NextRequest, NextResponse } from "next/server";

interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
}

interface CustomBody {
  body: {
    email: string;
    password: string;
  };
}

type UserRequest = NextRequest & CustomBody;

// acts as a mock api
export async function POST(request: UserRequest) {
  const user = (await request.json()) as User;

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
