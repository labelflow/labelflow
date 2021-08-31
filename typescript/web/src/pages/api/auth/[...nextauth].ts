import NextAuth, { User as NextAuthUser } from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

interface NextAuthUserWithStringId extends NextAuthUser {
  id: string;
}

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.POSTGRES_EXTERNAL_URL } },
});

export default NextAuth({
  providers: [
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // Needed to avoid issue https://github.com/nextauthjs/adapters/issues/111
      profile(profile: {
        id: string;
        name?: string;
        login?: string;
        email: string;
        avatar_url: string;
      }) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        } as NextAuthUserWithStringId;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  // Uncomment to implement your custom pages
  // pages: {
  //   signIn: "/auth/signin",
  //   signOut: "/auth/signout",
  //   error: "/auth/error", // Error code passed in query string as ?error=
  //   verifyRequest: "/auth/verify-request", // (used for check email message)
  //   newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
  // debug: true,
});
