import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession, type NextAuthOptions, User } from "next-auth";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

interface ExtendedUser extends User {
  id: string;
}

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

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
        try {
          const email = credentials.email;
          const password = credentials.password;

          // Query the database to find the user with the provided email.
          const result = await sql`SELECT * FROM users WHERE email = ${email}`;

          // If a user is found, and the password matches, return the user details.
          if (result.rows.length > 0) {
            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.hashed_password);

            if (passwordMatch) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
              };
            }
          }

          // If no user is found, or the password doesn't match, throw an error.
          throw new Error("Invalid username or password");
        } catch (error: any) {
          throw new Error(error.message || "An unknown error occurred during authentication");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // domain: VERCEL_DEPLOYMENT ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id; // Adding user id to the token
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        const user = session.user as ExtendedUser;
        user.id = token.id as string;
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
    };
  } | null>;
}
