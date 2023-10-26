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
  const user = (await request.json()) as any;

  if (user) {
    const filePath = path.join(process.cwd(), "mock-data", "users.json");
    const rawdata = fs.readFileSync(filePath);

    const users = JSON.parse(rawdata.toString()) as User[];

    const userExists = users.find((u) => u.email === user.email);

    if (!userExists) {
      // Generating JWT
      const secretKey = process.env.SECRET as string;
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, secretKey, { expiresIn: "1h" });

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
        error: "A user with the same email already exists!",
      });
    }
  }
}
