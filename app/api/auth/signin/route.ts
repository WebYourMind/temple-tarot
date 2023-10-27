import { NextRequest, NextResponse } from "next/server";

interface Credentials {
  email: string;
  password: string;
}

// acts as a mock api
export async function POST(request: NextRequest & Credentials) {
  const credentials = { email: request.email, password: request.password }; // (await request.json()) as any;

  if (credentials) {
    const users = [{ name: "test", password: "test", token: "abc123", id: "1", email: "test@example.com" }];

    const user = users.find((u) => u.email === credentials.email && u.password === credentials.password);

    if (user) {
      //   // Generating JWT
      //   const secretKey = process.env.SECRET as string;
      //   const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, secretKey, { expiresIn: "1h" });

      return NextResponse.json(
        { token: user.token, id: user.id, email: user.email, name: user.name },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          error: "Authentication failed.",
        },
        {
          status: 401,
        }
      );
    }
  }
}
