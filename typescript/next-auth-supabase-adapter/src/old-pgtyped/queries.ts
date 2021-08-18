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
      codeRefs: { used: [{ a: 950, b: 952, line: 38, col: 5 }] },
    },
    {
      name: "email",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 960, b: 964, line: 39, col: 5 }] },
    },
    {
      name: "role",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 972, b: 975, line: 40, col: 5 }] },
    },
    {
      name: "emailConfirmedAt",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 983, b: 998, line: 41, col: 5 }] },
    },
    {
      name: "rawAppMetaData",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1006, b: 1019, line: 42, col: 5 }] },
    },
    {
      name: "rawUserMetaData",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1027, b: 1041, line: 43, col: 5 }] },
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
    body: "INSERT INTO auth.users (\n    instance_id,\n    id,\n    aud,\n    email,\n    role,\n    email_confirmed_at,\n    raw_app_meta_data,\n    raw_user_meta_data,\n    created_at,\n    updated_at,\n    is_super_admin\n  )\nVALUES (\n    '00000000-0000-0000-0000-000000000000'::uuid,\n    uuid_generate_v4(),\n    :aud,\n    :email,\n    :role,\n    :emailConfirmedAt,\n    :rawAppMetaData,\n    :rawUserMetaData,\n    NOW(),\n    NOW(),\n    FALSE\n  )\nRETURNING *                                                                           ",
    loc: { a: 656, b: 1090, line: 22, col: 0 },
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
 *     raw_user_meta_data,
 *     created_at,
 *     updated_at,
 *     is_super_admin
 *   )
 * VALUES (
 *     '00000000-0000-0000-0000-000000000000'::uuid,
 *     uuid_generate_v4(),
 *     :aud,
 *     :email,
 *     :role,
 *     :emailConfirmedAt,
 *     :rawAppMetaData,
 *     :rawUserMetaData,
 *     NOW(),
 *     NOW(),
 *     FALSE
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
  rawUserMetaData: Json | null | void;
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
      codeRefs: { used: [{ a: 1232, b: 1236, line: 52, col: 22 }] },
    },
    {
      name: "rawUserMetaData",
      transform: { type: "scalar" },
      codeRefs: {
        used: [
          { a: 1307, b: 1321, line: 54, col: 27 },
          { a: 1329, b: 1343, line: 55, col: 5 },
        ],
      },
    },
    {
      name: "id",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1385, b: 1386, line: 58, col: 12 }] },
    },
  ],
  usedParamSet: { email: true, rawUserMetaData: true, id: true },
  statement: {
    body: "UPDATE auth.users\nSET email = COALESCE(:email, email),\n  raw_user_meta_data = COALESCE(\n    raw_user_meta_data || :rawUserMetaData,\n    :rawUserMetaData,\n    raw_user_meta_data\n  )\nWHERE id = :id\nRETURNING *                                                                           ",
    loc: { a: 1192, b: 1398, line: 51, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * UPDATE auth.users
 * SET email = COALESCE(:email, email),
 *   raw_user_meta_data = COALESCE(
 *     raw_user_meta_data || :rawUserMetaData,
 *     :rawUserMetaData,
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
      codeRefs: { used: [{ a: 1535, b: 1536, line: 63, col: 12 }] },
    },
  ],
  usedParamSet: { id: true },
  statement: {
    body: "DELETE FROM auth.users\nWHERE id = :id\nRETURNING *                                                                           ",
    loc: { a: 1500, b: 1548, line: 62, col: 0 },
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

/** 'LinkAccountUpdateUser' parameters type */
export interface ILinkAccountUpdateUserParams {
  rawAppMetaData: Json | null | void;
  userId: string | null | void;
}

/** 'LinkAccountUpdateUser' return type */
export interface ILinkAccountUpdateUserResult {
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

/** 'LinkAccountUpdateUser' query type */
export interface ILinkAccountUpdateUserQuery {
  params: ILinkAccountUpdateUserParams;
  result: ILinkAccountUpdateUserResult;
}

const linkAccountUpdateUserIR: any = {
  name: "LinkAccountUpdateUser",
  params: [
    {
      name: "rawAppMetaData",
      transform: { type: "scalar" },
      codeRefs: {
        used: [
          { a: 1739, b: 1752, line: 69, col: 26 },
          { a: 1760, b: 1773, line: 70, col: 5 },
        ],
      },
    },
    {
      name: "userId",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 1814, b: 1819, line: 73, col: 12 }] },
    },
  ],
  usedParamSet: { rawAppMetaData: true, userId: true },
  statement: {
    body: "UPDATE auth.users\nSET raw_app_meta_data = COALESCE(\n    raw_app_meta_data || :rawAppMetaData,\n    :rawAppMetaData,\n    raw_app_meta_data\n  )\nWHERE id = :userId\nRETURNING *                                                                           ",
    loc: { a: 1661, b: 1831, line: 67, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * UPDATE auth.users
 * SET raw_app_meta_data = COALESCE(
 *     raw_app_meta_data || :rawAppMetaData,
 *     :rawAppMetaData,
 *     raw_app_meta_data
 *   )
 * WHERE id = :userId
 * RETURNING *
 * ```
 */
export const linkAccountUpdateUser = new PreparedQuery<
  ILinkAccountUpdateUserParams,
  ILinkAccountUpdateUserResult
>(linkAccountUpdateUserIR);

/** 'LinkAccountCreateRefreshToken' parameters type */
export interface ILinkAccountCreateRefreshTokenParams {
  token: string | null | void;
  userId: string | null | void;
}

/** 'LinkAccountCreateRefreshToken' return type */
export interface ILinkAccountCreateRefreshTokenResult {
  instance_id: string | null;
  id: string;
  token: string | null;
  user_id: string | null;
  revoked: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

/** 'LinkAccountCreateRefreshToken' query type */
export interface ILinkAccountCreateRefreshTokenQuery {
  params: ILinkAccountCreateRefreshTokenParams;
  result: ILinkAccountCreateRefreshTokenResult;
}

const linkAccountCreateRefreshTokenIR: any = {
  name: "LinkAccountCreateRefreshToken",
  params: [
    {
      name: "token",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 2139, b: 2143, line: 87, col: 5 }] },
    },
    {
      name: "userId",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 2151, b: 2156, line: 88, col: 5 }] },
    },
  ],
  usedParamSet: { token: true, userId: true },
  statement: {
    body: "INSERT INTO auth.refresh_tokens (\n    instance_id,\n    token,\n    user_id,\n    revoked,\n    created_at,\n    updated_at\n  )\nVALUES (\n    '00000000-0000-0000-0000-000000000000'::uuid,\n    :token,\n    :userId,\n    FALSE,\n    NOW(),\n    NOW()\n  )\nRETURNING *                                                                           ",
    loc: { a: 1952, b: 2205, line: 77, col: 0 },
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
 *     FALSE,
 *     NOW(),
 *     NOW()
 *   )
 * RETURNING *
 * ```
 */
export const linkAccountCreateRefreshToken = new PreparedQuery<
  ILinkAccountCreateRefreshTokenParams,
  ILinkAccountCreateRefreshTokenResult
>(linkAccountCreateRefreshTokenIR);

/** 'UnlinkAccountUpdateUser' parameters type */
export interface IUnlinkAccountUpdateUserParams {
  rawAppMetaData: Json | null | void;
  userId: string | null | void;
}

/** 'UnlinkAccountUpdateUser' return type */
export interface IUnlinkAccountUpdateUserResult {
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

/** 'UnlinkAccountUpdateUser' query type */
export interface IUnlinkAccountUpdateUserQuery {
  params: IUnlinkAccountUpdateUserParams;
  result: IUnlinkAccountUpdateUserResult;
}

const unlinkAccountUpdateUserIR: any = {
  name: "UnlinkAccountUpdateUser",
  params: [
    {
      name: "rawAppMetaData",
      transform: { type: "scalar" },
      codeRefs: {
        used: [
          { a: 2398, b: 2411, line: 98, col: 26 },
          { a: 2419, b: 2432, line: 99, col: 5 },
        ],
      },
    },
    {
      name: "userId",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 2473, b: 2478, line: 102, col: 12 }] },
    },
  ],
  usedParamSet: { rawAppMetaData: true, userId: true },
  statement: {
    body: "UPDATE auth.users\nSET raw_app_meta_data = COALESCE(\n    raw_app_meta_data || :rawAppMetaData,\n    :rawAppMetaData,\n    raw_app_meta_data\n  )\nWHERE id = :userId\nRETURNING *                                                                           ",
    loc: { a: 2320, b: 2490, line: 96, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * UPDATE auth.users
 * SET raw_app_meta_data = COALESCE(
 *     raw_app_meta_data || :rawAppMetaData,
 *     :rawAppMetaData,
 *     raw_app_meta_data
 *   )
 * WHERE id = :userId
 * RETURNING *
 * ```
 */
export const unlinkAccountUpdateUser = new PreparedQuery<
  IUnlinkAccountUpdateUserParams,
  IUnlinkAccountUpdateUserResult
>(unlinkAccountUpdateUserIR);

/** 'UnlinkAccountDeleteRefreshToken' parameters type */
export interface IUnlinkAccountDeleteRefreshTokenParams {
  userId: string | null | void;
}

/** 'UnlinkAccountDeleteRefreshToken' return type */
export interface IUnlinkAccountDeleteRefreshTokenResult {
  instance_id: string | null;
  id: string;
  token: string | null;
  user_id: string | null;
  revoked: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

/** 'UnlinkAccountDeleteRefreshToken' query type */
export interface IUnlinkAccountDeleteRefreshTokenQuery {
  params: IUnlinkAccountDeleteRefreshTokenParams;
  result: IUnlinkAccountDeleteRefreshTokenResult;
}

const unlinkAccountDeleteRefreshTokenIR: any = {
  name: "UnlinkAccountDeleteRefreshToken",
  params: [
    {
      name: "userId",
      transform: { type: "scalar" },
      codeRefs: { used: [{ a: 2662, b: 2667, line: 107, col: 17 }] },
    },
  ],
  usedParamSet: { userId: true },
  statement: {
    body: "DELETE FROM auth.refresh_tokens\nWHERE user_id = :userId\nRETURNING *",
    loc: { a: 2613, b: 2679, line: 106, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM auth.refresh_tokens
 * WHERE user_id = :userId
 * RETURNING *
 * ```
 */
export const unlinkAccountDeleteRefreshToken = new PreparedQuery<
  IUnlinkAccountDeleteRefreshTokenParams,
  IUnlinkAccountDeleteRefreshTokenResult
>(unlinkAccountDeleteRefreshTokenIR);
