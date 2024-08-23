import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession, type NextAuthOptions, User } from "next-auth";
import { sql } from "@vercel/postgres";
import { insertUser } from "./database/user.database";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials: any) => {
        try {
          const email = credentials.email;
          const password = credentials.password;

          // Query the database to find the user with the provided email.
          const result = await sql`SELECT * FROM users WHERE email = ${email}`;

          // If a user is found, and the password matches, return the user details.
          if (result.rows.length > 0) {
            const user = result.rows[0];
            const bcrypt = (await import("bcryptjs")).default;
            const passwordMatch = await bcrypt.compare(password, user.hashed_password);
            if (passwordMatch) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                isSubscribed: user.is_subscribed,
              };
            }
          }

          // If no user is found, or the password doesn't match, throw an error.
          throw new Error("Invalid email or password");
        } catch (error: any) {
          throw new Error(error.message || "An unknown error occurred during authentication");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const result = await sql`SELECT * FROM users WHERE email = ${profile.email}`;
        if (result.rows.length > 0) {
          const existingUser = result.rows[0];
          user.id = existingUser.id; // Link to existing user
          return true;
        } else {
          // Create a new user without a password
          const newUser = await insertUser(profile.name, profile.email, undefined, true);
          if (newUser) {
            user.id = newUser.id;
            return true;
          }
          return false;
        }
      }
      return true;
    },
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.user = user;
      }
      if (trigger === "update" && session?.isSubscribed) {
        token.isSubscribed = session.isSubscribed;
        // @ts-expect-error
        token.user.isSubscribed = session.isSubscribed;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token.user) {
        session.user = {
          ...session.user,
          ...(token.user as User),
        };
      }
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
      isSubscribed: boolean;
    };
  } | null>;
}
