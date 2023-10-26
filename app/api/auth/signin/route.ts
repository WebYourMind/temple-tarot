import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

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
  const credentials = (await request.json()) as any;

  if (credentials) {
    const filePath = path.join(process.cwd(), "mock-data", "users.json");
    const rawdata = fs.readFileSync(filePath);

    const users = JSON.parse(rawdata.toString()) as User[];

    const user = users.find((u) => u.email === credentials.email && u.password === credentials.password);

    if (user) {
      // Generating JWT
      const secretKey = process.env.SECRET as string;
      const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, secretKey, { expiresIn: "1h" });

      return NextResponse.json(
        {
          ok: true,
          token,
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json({
        ok: false,
        error: "Invalid credentials.",
      });
    }
  }
}
