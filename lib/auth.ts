import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Session } from "next-auth";
import { User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt/types";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  token: string;
}

interface CustomUser extends NextAuthUser {
  accessToken?: string;
}

interface ExtendedSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
    accessToken?: string;
  };
}

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
        const route = await import("app/api/auth/signin/route");
        const res = (await route.POST(credentials)) as Response;

        if (res.status === 200) {
          const user = (await res.json()) as User;
          return { ...user, accessToken: user.token } as CustomUser;
        } else {
          const errorData = (await res.json()) as { error: string };
          throw new Error(errorData.error || "An unknown error occurred");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: VERCEL_DEPLOYMENT ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user: CustomUser | null }) => {
      if (user) {
        token = {
          ...token,
          accessToken: user.accessToken,
        };
      }
      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      const userWithToken: ExtendedSession = {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string,
          accessToken: token.accessToken as string,
        },
      };
      return userWithToken;
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
