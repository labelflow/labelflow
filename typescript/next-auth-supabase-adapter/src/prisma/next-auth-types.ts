// From https://github.com/nextauthjs/adapters/blob/next/packages/prisma/prisma/schema.prisma
import type { AdapterSession, AdapterUser } from "next-auth/adapters";

export type NextAuthAccount = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  oauth_token_secret?: string;
  oauth_token?: string;
};

export type NextAuthUser = AdapterUser & {
  id: string;
  email: string;
  emailVerified: Date;
  name: string;
  image: string;
};

export type NextAuthSession = AdapterSession & {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user?: NextAuthUser;
};

export type NextAuthVerificationToken = {
  identifier: string;
  token: string;
  expires: Date;
};
