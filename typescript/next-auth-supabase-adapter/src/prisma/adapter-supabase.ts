import {
  PrismaClient,
  User as SupabaseUser,
  // RefreshToken as SupabaseRefreshToken,
} from "@prisma/client";
import type { Adapter } from "next-auth/adapters";
import { v4 as uuidv4 } from "uuid";
import {
  NextAuthAccount,
  NextAuthUser,
  // NextAuthVerificationToken,
} from "./next-auth-types";

const convertSupabaseUserToNextAuthUser = (
  user: SupabaseUser,
  throwIfNil = true
): NextAuthUser => {
  if (!user) {
    if (throwIfNil) {
      throw new Error("Could not find user");
    } else {
      return null;
    }
  }
  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailConfirmedAt,
    name: (user.rawUserMetaData as any).full_name,
    image: (user.rawUserMetaData as any).avatar_url,
  };
};

const convertNextAuthUserToSupabaseUser = (
  user: Partial<NextAuthUser>,
  throwIfNil = true
): Partial<SupabaseUser> => {
  if (!user) {
    if (throwIfNil) {
      throw new Error("Could not find user");
    } else {
      return null;
    }
  }
  return {
    id: user.id,
    email: user.email as string,
    emailConfirmedAt: user.emailVerified as Date,
    rawUserMetaData: {
      avatar_url: (user.name as string) ?? undefined,
      full_name: (user.image as string) ?? undefined,
    },
  };
};

const convertSupabaseUserToNextAuthAccount = (
  user: SupabaseUser,
  throwIfNil = true
): NextAuthAccount => {
  if (!user) {
    if (throwIfNil) {
      throw new Error("Could not find account");
    } else {
      return null;
    }
  }
  return {
    id: user.id,
    userId: user.id,
    type: (user.rawAppMetaData as any).provider,
    provider: (user.rawAppMetaData as any).provider,
    providerAccountId: (user.rawAppMetaData as any).providerAccountId,
    // refresh_token: string,
    // access_token: string,
    // expires_at: number,
    // token_type: string,
    // scope: string,
    // id_token: string,
    // session_state: string,
    // oauth_token_secret: string,
    // oauth_token: string
  };
};

const convertNextAuthAccountToSupabaseUser = (
  account: Partial<NextAuthAccount>,
  throwIfNil = true
): Partial<SupabaseUser> => {
  if (!account) {
    if (throwIfNil) {
      throw new Error("Could not find account");
    } else {
      return null;
    }
  }

  return {
    id: account.userId,
    rawAppMetaData: {
      provider: account.provider,
      providerAccountId: account.providerAccountId,
    },
  };
};

export function SupabaseAdapter({
  prismaClient,
  databaseUrl,
}: {
  prismaClient: PrismaClient;
  databaseUrl: string;
}): Adapter {
  let p;

  if (prismaClient) {
    p = prismaClient;
  } else if (databaseUrl) {
    p = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
  } else {
    throw new Error(
      "NextAuthSupabaseAdapter must be constructed with either prismaClient or databaseUrl parameters."
    );
  }

  return {
    createUser: async (data) => {
      const now = new Date();
      const id = uuidv4();
      const supabaseUser = convertNextAuthUserToSupabaseUser(data);
      const user = await p.user.create({
        data: {
          ...supabaseUser,
          id,
          instanceId: "00000000-0000-0000-0000-000000000000",
          aud: "authenticated",
          role: "authenticated",
          rawAppMetaData: {},
          rawUserMetaData: {
            full_name: (data.name as string) ?? undefined,
            avatar_url: (data.image as string) ?? undefined,
          },
          createdAt: now,
          updatedAt: now,
          isSuperAdmin: false,
        },
      });
      return convertSupabaseUserToNextAuthUser(user);
    },
    getUser: async (id) => {
      const user = await p.user.findUnique({ where: { id } });
      return convertSupabaseUserToNextAuthUser(user);
    },
    getUserByEmail: async (email) => {
      const user = await p.user.findUnique({ where: { email } });
      return convertSupabaseUserToNextAuthUser(user);
    },
    getUserByAccount: async (provider_providerAccountId) => {
      const user = await p.user.findFirst({
        where: {
          AND: [
            {
              rawAppMetaData: {
                path: ["provider"],
                equals: provider_providerAccountId.provider,
              },
            },
            {
              rawAppMetaData: {
                path: ["providerAccountId"],
                equals: provider_providerAccountId.providerAccountId,
              },
            },
          ],
        },
      });

      return convertSupabaseUserToNextAuthUser(user, false);
    },
    updateUser: async (data) => {
      const now = new Date();

      const userBefore = await p.user.findUnique({
        where: { id: data.id },
        select: { rawUserMetaData: true },
      });

      const user = await p.user.update({
        where: { id: data.id },
        data: {
          id: data.id,
          email: data.email as string,
          emailConfirmedAt: data.emailVerified as Date,
          rawUserMetaData: {
            ...(userBefore.rawUserMetaData as any),
            full_name: (data.name as string) ?? undefined,
            avatar_url: (data.image as string) ?? undefined,
          },
          updatedAt: now,
        },
      });
      return convertSupabaseUserToNextAuthUser(user, false);
    },
    deleteUser: async (id) => {
      await p.user.delete({ where: { id } });
    },
    linkAccount: async (data) => {
      const now = new Date();
      const userBefore = await p.user.findUnique({
        where: { id: data.userId },
      });
      const accountBefore = convertSupabaseUserToNextAuthAccount(userBefore);
      const accountAfter: Omit<NextAuthAccount, "id"> = {
        ...data,
      };
      if (
        accountBefore.provider &&
        accountBefore.provider !== accountAfter.provider
      ) {
        console.warn(
          `Supabase only supports a single account per user. The user with id "${data.userId}" will be unlinked from provider "${accountBefore.provider}" and linked to provider "${accountAfter.provider}". See https://next-auth.js.org/adapters/models#account`
        );
      }
      const userAfter = convertNextAuthAccountToSupabaseUser(accountAfter);
      await p.user.update({
        where: { id: data.userId },
        data: {
          id: data.userId,
          rawAppMetaData: {
            ...(userBefore.rawAppMetaData as any),
            ...(userAfter.rawAppMetaData as any),
          },
          updatedAt: now,
        },
      });
    },
    unlinkAccount: async (provider_providerAccountId) => {
      const now = new Date();
      const user = await p.user.findFirst({
        where: {
          AND: [
            {
              rawAppMetaData: {
                path: ["provider"],
                equals: provider_providerAccountId.provider,
              },
            },
            {
              rawAppMetaData: {
                path: ["providerAccountId"],
                equals: provider_providerAccountId.providerAccountId,
              },
            },
          ],
        },
      });

      // const user =
      await p.user.update({
        where: { id: user.id },
        data: {
          rawAppMetaData: {
            ...(user.rawAppMetaData as any),
            provider: null,
            providerAccountId: null,
          },
          updatedAt: now,
        },
      });
    },
    getSessionAndUser: async () => {
      throw new Error(
        "Supabase only supports JWT sessions, not database sessions, set `jwt: true` in Next-Auth configuration. See https://next-auth.js.org/configuration/options#session and https://next-auth.js.org/adapters/models#session"
      );
    },
    createSession: async () => {
      throw new Error(
        "Supabase only supports JWT sessions, not database sessions, set `jwt: true` in Next-Auth configuration. See https://next-auth.js.org/configuration/options#session and https://next-auth.js.org/adapters/models#session"
      );
    },
    updateSession: async () => {
      throw new Error(
        "Supabase only supports JWT sessions, not database sessions, set `jwt: true` in Next-Auth configuration. See https://next-auth.js.org/configuration/options#session and https://next-auth.js.org/adapters/models#session"
      );
    },
    deleteSession: async () => {
      throw new Error(
        "Supabase only supports JWT sessions, not database sessions, set `jwt: true` in Next-Auth configuration. See https://next-auth.js.org/configuration/options#session and https://next-auth.js.org/adapters/models#session"
      );
    },
    createVerificationToken: async (data) => {
      console.log("createVerificationToken", data);
      throw new Error(
        "Supabase adapter does not support email verification, remove the email provider in Next-Auth configuration. See https://next-auth.js.org/providers/email"
      );
    },
    useVerificationToken: async (identifier_token) => {
      console.log("useVerificationToken", identifier_token);
      throw new Error(
        "Supabase adapter does not support email verification, remove the email provider in Next-Auth configuration. See https://next-auth.js.org/providers/email"
      );
    },
  };
}
