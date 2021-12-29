import { createPrismaClient } from "@labelflow/db/src/prisma-client";
import { filterNil, getEnv } from "@labelflow/utils";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient as PrismaClientClass } from "@prisma/client";
import { captureException } from "@sentry/nextjs";
import { isEmpty, isNil } from "lodash/fp";
import NextAuth, { Profile } from "next-auth";
import { OAuthConfig, OAuthUserConfig, Provider } from "next-auth/providers";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { sendVerificationRequestFromPrisma } from "../../../utils/email/send-verification-request";

// https://next-auth.js.org/configuration/options#secret
if (process.env.NODE_ENV === "production" && isEmpty(process.env.JWT_SECRET)) {
  throw new Error("Missing required environment variable JWT_SECRET");
}

// interface NextAuthUserWithStringId extends NextAuthUser {
//   id: string;
// }

// Try to use the prisma singleton defined in typescript/db/src/prisma-client.ts
declare module globalThis {
  let prismaInstance: PrismaClientClass;
  let prismaInstanceIsConnected: boolean;
}
if (!globalThis.prismaInstance) {
  console.log("[Prisma Client] Initializing prismaInstance from next auth");
  globalThis.prismaInstance = createPrismaClient();
}
globalThis.prismaInstanceIsConnected = true;

const getEmailProvider = () => {
  const server = process.env.EMAIL_SERVER;
  if (isNil(server)) return undefined;
  const from = getEnv("EMAIL_FROM");
  const sendVerificationRequest = sendVerificationRequestFromPrisma(
    globalThis.prismaInstance
  );
  return EmailProvider({ server, from, sendVerificationRequest });
};

const getOAuthConfig = <TProfile = Profile>(
  idVar: string,
  secretVar: string
): OAuthUserConfig<TProfile> | undefined => {
  const clientId = process.env[idVar];
  if (isNil(clientId)) return undefined;
  const clientSecret = getEnv(secretVar);
  return { clientId, clientSecret };
};

const getOAuthProvider = <TProfile = Profile>(
  idVar: string,
  secretVar: string,
  factory: (config: OAuthUserConfig<TProfile>) => OAuthConfig<TProfile>
): OAuthConfig<TProfile> | undefined => {
  const config = getOAuthConfig<TProfile>(idVar, secretVar);
  if (isNil(config)) return undefined;
  return factory(config);
};

const getGoogleProvider = () => {
  return getOAuthProvider(
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    GoogleProvider
  );
};

const getGitHubProvider = () => {
  return getOAuthProvider(
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    GitHubProvider
  );
};

const getProviders = (): Provider[] => {
  const providers = filterNil([
    getEmailProvider(),
    getGoogleProvider(),
    getGitHubProvider(),
  ]);
  if (process.env.NODE_ENV === "production" && isEmpty(providers)) {
    throw new Error("No authentication provider has been configured");
  }
  return providers;
};

export default NextAuth({
  providers: getProviders(),
  adapter: PrismaAdapter(globalThis.prismaInstance),
  secret: process.env.JWT_SECRET,
  session: { strategy: "jwt" },
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
    session: ({ session, user, token }) =>
      // : {
      //   session: Session;
      //   user: NextAuthUserWithStringId;
      // }
      {
        // eslint-disable-next-line no-param-reassign
        session.user.id = user?.id ?? token.sub;
        return session;
      },
  },
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
      captureException(metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
});
