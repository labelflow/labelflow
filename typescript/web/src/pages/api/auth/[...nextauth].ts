import NextAuth, { User as NextAuthUser } from "next-auth";

import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

interface NextAuthUserWithStringId extends NextAuthUser {
  id: string;
}

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.POSTGRES_EXTERNAL_URL } },
});

(async () => {
  const users = await prisma.user.findMany();

  console.log("users", users);
})();

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  // Uncomment to implement your custom pages
  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  // debug: true,
  callbacks: {
    session: ({
      session,
      user,
    }: {
      session: Session;
      user: NextAuthUserWithStringId;
    }) => {
      if (session?.user && user?.id) {
        // eslint-disable-next-line no-param-reassign
        session.user.id = user?.id;
      }
      return session;
    },
  },
});
