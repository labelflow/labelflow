/** Types generated for queries found in "src/connectors/next-auth-supabase-adapter/queries.sql" */
import { PreparedQuery } from "@pgtyped/query";

export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

/** 'GetUserById' parameters type */
export interface IGetUserByIdParams {
  id: string | null | void;
}

/** 'GetUserById' return type */
export interface IGetUserByIdResult {
  instance_id: string | null;
  id: string;
  aud: string | null;
  role: string | null;
  email: string | null;
  encrypted_password: string | null;
  email_confirmed_at: Date | null;
  invited_at: Date | null;
  confirmation_token: string | null;
  confirmation_sent_at: Date | null;
  recovery_token: string | null;
  recovery_sent_at: Date | null;
  email_change_token: string | null;
  email_change: string | null;
  email_change_sent_at: Date | null;
  last_sign_in_at: Date | null;
  raw_app_meta_data: Json | null;
  raw_user_meta_data: Json | null;
  is_super_admin: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  phone: string | null;
  phone_confirmed_at: Date | null;
  phone_change: string | null;
  phone_change_token: string | null;
  phone_change_sent_at: Date | null;
  confirmed_at: Date | null;
}

/** 'GetUserById' query type */
export interface IGetUserByIdQuery {
  params: IGetUserByIdParams;
  result: IGetUserByIdResult;
}

const getUserByIdIR: any = {
  name: "GetUserById",
  params: [
    {
      name: "id",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 137, b: 138, line: 5, col: 12 }] },
    },
  ],
  usedParamSet: { id: true },
  statement: {
    body: "SELECT *\nFROM auth.users\nWHERE id = :id\nLIMIT 1                                                                           ",
    loc: { a: 100, b: 146, line: 3, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM auth.users
 * WHERE id = :id
 * LIMIT 1
 * ```
 */
export const getUserById = new PreparedQuery<
  IGetUserByIdParams,
  IGetUserByIdResult
>(getUserByIdIR);

/** 'GetUserByEmail' parameters type */
export interface IGetUserByEmailParams {
  email: string | null | void;
}

/** 'GetUserByEmail' return type */
export interface IGetUserByEmailResult {
  instance_id: string | null;
  id: string;
  aud: string | null;
  role: string | null;
  email: string | null;
  encrypted_password: string | null;
  email_confirmed_at: Date | null;
  invited_at: Date | null;
  confirmation_token: string | null;
  confirmation_sent_at: Date | null;
  recovery_token: string | null;
  recovery_sent_at: Date | null;
  email_change_token: string | null;
  email_change: string | null;
  email_change_sent_at: Date | null;
  last_sign_in_at: Date | null;
  raw_app_meta_data: Json | null;
  raw_user_meta_data: Json | null;
  is_super_admin: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  phone: string | null;
  phone_confirmed_at: Date | null;
  phone_change: string | null;
  phone_change_token: string | null;
  phone_change_sent_at: Date | null;
  confirmed_at: Date | null;
}

/** 'GetUserByEmail' query type */
export interface IGetUserByEmailQuery {
  params: IGetUserByEmailParams;
  result: IGetUserByEmailResult;
}

const getUserByEmailIR: any = {
  name: "GetUserByEmail",
  params: [
    {
      name: "email",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 292, b: 296, line: 11, col: 15 }] },
    },
  ],
  usedParamSet: { email: true },
  statement: {
    body: "SELECT *\nFROM auth.users\nWHERE email = :email\nLIMIT 1                                                                           ",
    loc: { a: 252, b: 304, line: 9, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM auth.users
 * WHERE email = :email
 * LIMIT 1
 * ```
 */
export const getUserByEmail = new PreparedQuery<
  IGetUserByEmailParams,
  IGetUserByEmailResult
>(getUserByEmailIR);

/** 'GetUserByProviderAccountId' parameters type */
export interface IGetUserByProviderAccountIdParams {
  providerId: Json | null | void;
  providerAccountId: Json | null | void;
}

/** 'GetUserByProviderAccountId' return type */
export interface IGetUserByProviderAccountIdResult {
  instance_id: string | null;
  id: string;
  aud: string | null;
  role: string | null;
  email: string | null;
  encrypted_password: string | null;
  email_confirmed_at: Date | null;
  invited_at: Date | null;
  confirmation_token: string | null;
  confirmation_sent_at: Date | null;
  recovery_token: string | null;
  recovery_sent_at: Date | null;
  email_change_token: string | null;
  email_change: string | null;
  email_change_sent_at: Date | null;
  last_sign_in_at: Date | null;
  raw_app_meta_data: Json | null;
  raw_user_meta_data: Json | null;
  is_super_admin: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  phone: string | null;
  phone_confirmed_at: Date | null;
  phone_change: string | null;
  phone_change_token: string | null;
  phone_change_sent_at: Date | null;
  confirmed_at: Date | null;
}

/** 'GetUserByProviderAccountId' query type */
export interface IGetUserByProviderAccountIdQuery {
  params: IGetUserByProviderAccountIdParams;
  result: IGetUserByProviderAccountIdResult;
}

const getUserByProviderAccountIdIR: any = {
  name: "GetUserByProviderAccountId",
  params: [
    {
      name: "providerId",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 486, b: 495, line: 17, col: 39 }] },
    },
    {
      name: "providerAccountId",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 530, b: 546, line: 18, col: 33 }] },
    },
  ],
  usedParamSet: { providerId: true, providerAccountId: true },
  statement: {
    body: "SELECT *\nFROM auth.users\nWHERE raw_app_meta_data->'provider' = :providerId\n  AND raw_app_meta_data->'id' = :providerAccountId\nLIMIT 1                                                                           ",
    loc: { a: 422, b: 554, line: 15, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM auth.users
 * WHERE raw_app_meta_data->'provider' = :providerId
 *   AND raw_app_meta_data->'id' = :providerAccountId
 * LIMIT 1
 * ```
 */
export const getUserByProviderAccountId = new PreparedQuery<
  IGetUserByProviderAccountIdParams,
  IGetUserByProviderAccountIdResult
>(getUserByProviderAccountIdIR);

/** 'CreateUser' parameters type */
export interface ICreateUserParams {
  aud: string | null | void;
  email: string | null | void;
  role: string | null | void;
  emailConfirmedAt: Date | null | void;
  rawAppMetaData: Json | null | void;
  rawUserMetaData: Json | null | void;
}

/** 'CreateUser' return type */
export interface ICreateUserResult {
  instance_id: string | null;
  id: string;
  aud: string | null;
  role: string | null;
  email: string | null;
  encrypted_password: string | null;
  email_confirmed_at: Date | null;
  invited_at: Date | null;
  confirmation_token: string | null;
  confirmation_sent_at: Date | null;
  recovery_token: string | null;
  recovery_sent_at: Date | null;
  email_change_token: string | null;
  email_change: string | null;
  email_change_sent_at: Date | null;
  last_sign_in_at: Date | null;
  raw_app_meta_data: Json | null;
  raw_user_meta_data: Json | null;
  is_super_admin: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  phone: string | null;
  phone_confirmed_at: Date | null;
  phone_change: string | null;
  phone_change_token: string | null;
  phone_change_sent_at: Date | null;
  confirmed_at: Date | null;
}

/** 'CreateUser' query type */
export interface ICreateUserQuery {
  params: ICreateUserParams;
  result: ICreateUserResult;
}

const createUserIR: any = {
  name: "CreateUser",
  params: [
    {
      name: "aud",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 898, b: 900, line: 35, col: 5 }] },
    },
    {
      name: "email",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 908, b: 912, line: 36, col: 5 }] },
    },
    {
      name: "role",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 920, b: 923, line: 37, col: 5 }] },
    },
    {
      name: "emailConfirmedAt",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 931, b: 946, line: 38, col: 5 }] },
    },
    {
      name: "rawAppMetaData",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 954, b: 967, line: 39, col: 5 }] },
    },
    {
      name: "rawUserMetaData",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 975, b: 989, line: 40, col: 5 }] },
    },
  ],
  usedParamSet: {
    aud: true,
    email: true,
    role: true,
    emailConfirmedAt: true,
    rawAppMetaData: true,
    rawUserMetaData: true,
  },
  statement: {
    body: "INSERT INTO auth.users (\n    instance_id,\n    id,\n    aud,\n    email,\n    role,\n    email_confirmed_at,\n    raw_app_meta_data,\n    raw_user_meta_data\n  )\nVALUES (\n    '00000000-0000-0000-0000-000000000000'::uuid,\n    uuid_generate_v4(),\n    :aud,\n    :email,\n    :role,\n    :emailConfirmedAt,\n    :rawAppMetaData,\n    :rawUserMetaData\n  )\nRETURNING *                                                                           ",
    loc: { a: 656, b: 1005, line: 22, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO auth.users (
 *     instance_id,
 *     id,
 *     aud,
 *     email,
 *     role,
 *     email_confirmed_at,
 *     raw_app_meta_data,
 *     raw_user_meta_data
 *   )
 * VALUES (
 *     '00000000-0000-0000-0000-000000000000'::uuid,
 *     uuid_generate_v4(),
 *     :aud,
 *     :email,
 *     :role,
 *     :emailConfirmedAt,
 *     :rawAppMetaData,
 *     :rawUserMetaData
 *   )
 * RETURNING *
 * ```
 */
export const createUser = new PreparedQuery<
  ICreateUserParams,
  ICreateUserResult
>(createUserIR);

/** 'UpdateUser' parameters type */
export interface IUpdateUserParams {
  email: string | null | void;
  rawAppMetaData: Json | null | void;
  id: string | null | void;
}

/** 'UpdateUser' return type */
export interface IUpdateUserResult {
  instance_id: string | null;
  id: string;
  aud: string | null;
  role: string | null;
  email: string | null;
  encrypted_password: string | null;
  email_confirmed_at: Date | null;
  invited_at: Date | null;
  confirmation_token: string | null;
  confirmation_sent_at: Date | null;
  recovery_token: string | null;
  recovery_sent_at: Date | null;
  email_change_token: string | null;
  email_change: string | null;
  email_change_sent_at: Date | null;
  last_sign_in_at: Date | null;
  raw_app_meta_data: Json | null;
  raw_user_meta_data: Json | null;
  is_super_admin: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  phone: string | null;
  phone_confirmed_at: Date | null;
  phone_change: string | null;
  phone_change_token: string | null;
  phone_change_sent_at: Date | null;
  confirmed_at: Date | null;
}

/** 'UpdateUser' query type */
export interface IUpdateUserQuery {
  params: IUpdateUserParams;
  result: IUpdateUserResult;
}

const updateUserIR: any = {
  name: "UpdateUser",
  params: [
    {
      name: "email",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1147, b: 1151, line: 46, col: 22 }] },
    },
    {
      name: "rawAppMetaData",
      transform: { type: "scalar" },
      codeRefs: {
        used: [
          { a: 1222, b: 1235, line: 48, col: 27 },
          { a: 1243, b: 1256, line: 49, col: 5 },
        ],
      },
    },
    {
      name: "id",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1298, b: 1299, line: 52, col: 12 }] },
    },
  ],
  usedParamSet: { email: true, rawAppMetaData: true, id: true },
  statement: {
    body: "UPDATE auth.users\nSET email = COALESCE(:email, email),\n  raw_user_meta_data = COALESCE(\n    raw_user_meta_data || :rawAppMetaData,\n    :rawAppMetaData,\n    raw_user_meta_data\n  )\nWHERE id = :id\nRETURNING *                                                                           ",
    loc: { a: 1107, b: 1311, line: 45, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * UPDATE auth.users
 * SET email = COALESCE(:email, email),
 *   raw_user_meta_data = COALESCE(
 *     raw_user_meta_data || :rawAppMetaData,
 *     :rawAppMetaData,
 *     raw_user_meta_data
 *   )
 * WHERE id = :id
 * RETURNING *
 * ```
 */
export const updateUser = new PreparedQuery<
  IUpdateUserParams,
  IUpdateUserResult
>(updateUserIR);

/** 'DeleteUser' parameters type */
export interface IDeleteUserParams {
  id: string | null | void;
}

/** 'DeleteUser' return type */
export interface IDeleteUserResult {
  instance_id: string | null;
  id: string;
  aud: string | null;
  role: string | null;
  email: string | null;
  encrypted_password: string | null;
  email_confirmed_at: Date | null;
  invited_at: Date | null;
  confirmation_token: string | null;
  confirmation_sent_at: Date | null;
  recovery_token: string | null;
  recovery_sent_at: Date | null;
  email_change_token: string | null;
  email_change: string | null;
  email_change_sent_at: Date | null;
  last_sign_in_at: Date | null;
  raw_app_meta_data: Json | null;
  raw_user_meta_data: Json | null;
  is_super_admin: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  phone: string | null;
  phone_confirmed_at: Date | null;
  phone_change: string | null;
  phone_change_token: string | null;
  phone_change_sent_at: Date | null;
  confirmed_at: Date | null;
}

/** 'DeleteUser' query type */
export interface IDeleteUserQuery {
  params: IDeleteUserParams;
  result: IDeleteUserResult;
}

const deleteUserIR: any = {
  name: "DeleteUser",
  params: [
    {
      name: "id",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1448, b: 1449, line: 57, col: 12 }] },
    },
  ],
  usedParamSet: { id: true },
  statement: {
    body: "DELETE FROM auth.users\nWHERE id = :id\nRETURNING *                                                                           ",
    loc: { a: 1413, b: 1461, line: 56, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM auth.users
 * WHERE id = :id
 * RETURNING *
 * ```
 */
export const deleteUser = new PreparedQuery<
  IDeleteUserParams,
  IDeleteUserResult
>(deleteUserIR);

/** 'LinkAccountUsers' parameters type */
export interface ILinkAccountUsersParams {
  email: string | null | void;
  userId: string | null | void;
}

/** 'LinkAccountUsers' return type */
export interface ILinkAccountUsersResult {
  instance_id: string | null;
  id: string;
  aud: string | null;
  role: string | null;
  email: string | null;
  encrypted_password: string | null;
  email_confirmed_at: Date | null;
  invited_at: Date | null;
  confirmation_token: string | null;
  confirmation_sent_at: Date | null;
  recovery_token: string | null;
  recovery_sent_at: Date | null;
  email_change_token: string | null;
  email_change: string | null;
  email_change_sent_at: Date | null;
  last_sign_in_at: Date | null;
  raw_app_meta_data: Json | null;
  raw_user_meta_data: Json | null;
  is_super_admin: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  phone: string | null;
  phone_confirmed_at: Date | null;
  phone_change: string | null;
  phone_change_token: string | null;
  phone_change_sent_at: Date | null;
  confirmed_at: Date | null;
}

/** 'LinkAccountUsers' query type */
export interface ILinkAccountUsersQuery {
  params: ILinkAccountUsersParams;
  result: ILinkAccountUsersResult;
}

const linkAccountUsersIR: any = {
  name: "LinkAccountUsers",
  params: [
    {
      name: "email",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1600, b: 1604, line: 62, col: 13 }] },
    },
    {
      name: "userId",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1618, b: 1623, line: 63, col: 12 }] },
    },
  ],
  usedParamSet: { email: true, userId: true },
  statement: {
    body: "UPDATE auth.users\nSET email = :email\nWHERE id = :userId\nRETURNING *                                                                           ",
    loc: { a: 1569, b: 1635, line: 61, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * UPDATE auth.users
 * SET email = :email
 * WHERE id = :userId
 * RETURNING *
 * ```
 */
export const linkAccountUsers = new PreparedQuery<
  ILinkAccountUsersParams,
  ILinkAccountUsersResult
>(linkAccountUsersIR);

/** 'LinkAccountRefreshTokens' parameters type */
export interface ILinkAccountRefreshTokensParams {
  token: string | null | void;
  userId: string | null | void;
  revoked: boolean | null | void;
}

/** 'LinkAccountRefreshTokens' return type */
export interface ILinkAccountRefreshTokensResult {
  instance_id: string | null;
  id: string;
  token: string | null;
  user_id: string | null;
  revoked: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

/** 'LinkAccountRefreshTokens' query type */
export interface ILinkAccountRefreshTokensQuery {
  params: ILinkAccountRefreshTokensParams;
  result: ILinkAccountRefreshTokensResult;
}

const linkAccountRefreshTokensIR: any = {
  name: "LinkAccountRefreshTokens",
  params: [
    {
      name: "token",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1938, b: 1942, line: 77, col: 5 }] },
    },
    {
      name: "userId",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1950, b: 1955, line: 78, col: 5 }] },
    },
    {
      name: "revoked",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1963, b: 1969, line: 79, col: 5 }] },
    },
  ],
  usedParamSet: { token: true, userId: true, revoked: true },
  statement: {
    body: "INSERT INTO auth.refresh_tokens (\n    instance_id,\n    token,\n    user_id,\n    revoked,\n    created_at,\n    updated_at\n  )\nVALUES (\n    '00000000-0000-0000-0000-000000000000'::uuid,\n    :token,\n    :userId,\n    :revoked,\n    NOW(),\n    NOW()\n  )\nRETURNING *",
    loc: { a: 1751, b: 2007, line: 67, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO auth.refresh_tokens (
 *     instance_id,
 *     token,
 *     user_id,
 *     revoked,
 *     created_at,
 *     updated_at
 *   )
 * VALUES (
 *     '00000000-0000-0000-0000-000000000000'::uuid,
 *     :token,
 *     :userId,
 *     :revoked,
 *     NOW(),
 *     NOW()
 *   )
 * RETURNING *
 * ```
 */
export const linkAccountRefreshTokens = new PreparedQuery<
  ILinkAccountRefreshTokensParams,
  ILinkAccountRefreshTokensResult
>(linkAccountRefreshTokensIR);
