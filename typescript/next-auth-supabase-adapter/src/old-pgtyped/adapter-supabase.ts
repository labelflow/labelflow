// import { Client } from "pg";

// import { createHash, randomBytes } from "crypto";
// import { Profile, Session, User } from "next-auth";
// import { Adapter } from "next-auth/adapters";
// import { EmailConfig } from "next-auth/providers";

// import {
//   getUserById,
//   getUserByEmail,
//   getUserByProviderAccountId,
//   createUser,
//   deleteUser,
//   updateUser,
//   linkAccountUpdateUser,
//   linkAccountCreateRefreshToken,
//   unlinkAccountUpdateUser,
//   unlinkAccountDeleteRefreshToken,
//   ICreateUserResult,
//   ILinkAccountCreateRefreshTokenResult,
// } from "./queries";

// export type SupabaseVerificationRequest = {
//   id: string;
//   identifier: string;
//   token: string;
//   expires: Date;
// };

// export type SupabaseUser = User & { id: string };

// export type SupabaseSession = Session & {
//   id: string;
//   expires: Date;
//   user: SupabaseUser;
// };

// export type SupabaseUserMetadata = {
//   name: string | null;
//   image: string | null;
// } | null;

// export type SupabaseProfile = Profile & { emailVerified?: Date };

// const convertUserResultsToUser = (
//   userResults: ICreateUserResult[]
// ): null | SupabaseUser => {
//   if (userResults.length !== 1) return null;
//   const userResult = userResults[0];
//   const userMetaData = userResult.raw_user_meta_data as SupabaseUserMetadata;
//   const result = {
//     id: userResult.id,
//     email: userResult.email,
//     image: userMetaData?.image,
//     name: userMetaData?.name,
//   };
//   return result;
// };

// const convertRefreshTokensResultsToRefreshToken = (
//   refreshTokens: ILinkAccountCreateRefreshTokenResult[]
// ): null | ILinkAccountCreateRefreshTokenResult => {
//   if (refreshTokens.length !== 1) return null;
//   const refreshToken = refreshTokens[0];
//   return refreshToken;
// };

// export const SupabaseAdapter = (pgClient: Client): Adapter => ({
//   displayName: "Supabase",
//   async createUser(profile: SupabaseProfile): Promise<SupabaseUser> {
//     const userResults = await createUser.run(
//       {
//         email: profile.email,
//         aud: "authenticated",
//         role: "authenticated",
//         emailConfirmedAt: profile.emailVerified ?? null,
//         rawAppMetaData: {
//           provider: "email",
//         },
//         rawUserMetaData: {
//           name: profile.name ?? null,
//           image: profile.image ?? null,
//           sub: profile.sub ?? null,
//         },
//       },
//       pgClient
//     );
//     return convertUserResultsToUser(userResults) as SupabaseUser;
//   },

//   async getUser(id: string): Promise<SupabaseUser | null> {
//     if (!id) return null;
//     const userResults = await getUserById.run({ id }, pgClient);
//     return convertUserResultsToUser(userResults);
//   },

//   async getUserByEmail(email: string | null): Promise<SupabaseUser | null> {
//     if (!email) return null;
//     const userResults = await getUserByEmail.run({ email }, pgClient);
//     return convertUserResultsToUser(userResults);
//   },

//   async getUserByProviderAccountId(
//     providerId: string,
//     providerAccountId: string
//   ): Promise<SupabaseUser | null> {
//     const userResults = await getUserByProviderAccountId.run(
//       { providerId, providerAccountId },
//       pgClient
//     );
//     return convertUserResultsToUser(userResults);
//   },

//   async updateUser(user: SupabaseUser): Promise<SupabaseUser> {
//     const userResults = await updateUser.run(
//       {
//         id: user.id,
//         email: user.email,
//         rawUserMetaData: {
//           name: user.name ?? null,
//           image: user.image ?? null,
//         },
//       },
//       pgClient
//     );
//     return convertUserResultsToUser(userResults) as SupabaseUser;
//   },

//   async deleteUser(id: string): Promise<void> {
//     await deleteUser.run({ id }, pgClient);
//   },

//   async linkAccount(
//     userId: string,
//     providerId: string,
//     providerType: string,
//     providerAccountId: string,
//     refreshToken?: string | undefined,
//     accessToken?: string | undefined,
//     accessTokenExpires?: null | undefined
//   ): Promise<void> {
//     await linkAccountUpdateUser.run(
//       {
//         userId,
//         rawAppMetaData: {
//           provider: providerId,
//           id: providerAccountId,
//         },
//       },
//       pgClient
//     );

//     await linkAccountCreateRefreshToken.run(
//       { userId, token: refreshToken },
//       pgClient
//     );
//   },

//   async unlinkAccount(
//     userId: string,
//     providerId: string,
//     providerAccountId: string
//   ): Promise<void> {
//     await unlinkAccountUpdateUser.run(
//       {
//         userId,
//         rawAppMetaData: {
//           provider: providerId,
//           id: providerAccountId,
//         },
//       },
//       pgClient
//     );

//     await unlinkAccountDeleteRefreshToken.run({ userId }, pgClient);
//   },

//   async createSession(user: SupabaseUser): Promise<SupabaseSession> {
//     // const sessionRef = await client.collection("sessions").add({
//     //   userId: user.id,
//     //   expires: new Date(Date.now() + sessionMaxAge),
//     //   sessionToken: randomBytes(32).toString("hex"),
//     //   accessToken: randomBytes(32).toString("hex"),
//     // });
//     // const snapshot = await sessionRef.get();
//     // const session = docSnapshotToObject(snapshot);
//     // return session;
//   },

//   async getSession(sessionToken: string): Promise<SupabaseSession | null> {
//     // const snapshot = await client
//     //   .collection("sessions")
//     //   .where("sessionToken", "==", sessionToken)
//     //   .limit(1)
//     //   .get();
//     // const session = querySnapshotToObject<SupabaseSession>(snapshot);
//     // if (!session) return null;
//     // // if the session has expired
//     // if (session.expires < new Date()) {
//     //   // delete the session
//     //   await client.collection("sessions").doc(session.id).delete();
//     //   return null;
//     // }
//     // // return already existing session
//     // return session;
//   },

//   async updateSession(
//     session: SupabaseSession,
//     force?: boolean | undefined
//   ): Promise<SupabaseSession | null> {
//     // if (
//     //   !force &&
//     //   Number(session.expires) - sessionMaxAge + sessionUpdateAge >
//     //     Date.now()
//     // ) {
//     //   return null;
//     // }
//     // // Update the item in the database
//     // await client
//     //   .collection("sessions")
//     //   .doc(session.id)
//     //   .update({
//     //     expires: new Date(Date.now() + sessionMaxAge),
//     //   });
//     // return session;
//   },

//   async deleteSession(sessionToken: string): Promise<void> {
//     // const snapshot = await client
//     //   .collection("sessions")
//     //   .where("sessionToken", "==", sessionToken)
//     //   .limit(1)
//     //   .get();
//     // const session = querySnapshotToObject<SupabaseSession>(snapshot);
//     // if (!session) return;
//     // await client.collection("sessions").doc(session.id).delete();
//   },

//   async createVerificationRequest(
//     identifier: string,
//     url: string,
//     token: string,
//     secret: string,
//     provider: EmailConfig & {
//       maxAge: number;
//       from: string;
//     }
//   ): Promise<void> {
//     // const verificationRequestRef = await client
//     //   .collection("verificationRequests")
//     //   .add({
//     //     identifier,
//     //     token: hashToken(token),
//     //     expires: new Date(Date.now() + provider.maxAge * 1000),
//     //   });
//     // // With the verificationCallback on a provider, you can send an email, or queue
//     // // an email to be sent, or perform some other action (e.g. send a text message)
//     // await provider.sendVerificationRequest({
//     //   identifier,
//     //   url,
//     //   token,
//     //   baseUrl: appOptions.baseUrl,
//     //   provider,
//     // });
//     // const snapshot = await verificationRequestRef.get();
//     // return docSnapshotToObject<SupabaseVerificationRequest>(snapshot);
//   },

//   async getVerificationRequest(
//     identifier: string,
//     verificationToken: string,
//     secret: string,
//     provider: Required<EmailConfig>
//   ): Promise<{
//     id: string;
//     identifier: string;
//     token: string;
//     expires: Date;
//   } | null> {
//     // const snapshot = await client
//     //   .collection("verificationRequests")
//     //   .where("token", "==", hashToken(token))
//     //   .where("identifier", "==", identifier)
//     //   .limit(1)
//     //   .get();
//     // const verificationRequest =
//     //   querySnapshotToObject<SupabaseVerificationRequest>(snapshot);
//     // if (!verificationRequest) return null;
//     // if (verificationRequest.expires < new Date()) {
//     //   // Delete verification entry so it cannot be used again
//     //   await client
//     //     .collection("verificationRequests")
//     //     .doc(verificationRequest.id)
//     //     .delete();
//     //   return null;
//     // }
//     // return verificationRequest;
//   },

//   async deleteVerificationRequest(
//     identifier: string,
//     verificationToken: string,
//     secret: string,
//     provider: Required<EmailConfig>
//   ): Promise<void> {
//     // const snapshot = await client
//     //   .collection("verificationRequests")
//     //   .where("token", "==", hashToken(token))
//     //   .where("identifier", "==", identifier)
//     //   .limit(1)
//     //   .get();
//     // const verificationRequest =
//     //   querySnapshotToObject<SupabaseVerificationRequest>(snapshot);
//     // if (!verificationRequest) return null;
//     // await client
//     //   .collection("verificationRequests")
//     //   .doc(verificationRequest.id)
//     //   .delete();
//   },
// });
