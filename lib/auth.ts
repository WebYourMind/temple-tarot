import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  token: string;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials: any) => {
        const token = credentials.token; // Retrieve the token

        if (token) {
          try {
            const secret = process.env.SECRET as string;
            const decoded = jwt.verify(token, secret) as User;

            // Return user information
            return { id: decoded.id, email: decoded.email, name: decoded.name };
          } catch (error) {
            return null; // token verification failed
          }
        } else {
          return null; // no token provided
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // Set to true in production
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        ...session.user,
        // @ts-expect-error
        id: token.sub,
      };
      return session;
    },
  },
};

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string;
      email: string;
    };
  } | null>;
}
