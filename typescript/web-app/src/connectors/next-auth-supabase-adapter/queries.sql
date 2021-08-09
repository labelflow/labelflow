/* --------------------------------------------------------------------- */
/* @name GetUserById */
SELECT *
FROM auth.users
WHERE id = :id
LIMIT 1;
/* --------------------------------------------------------------------- */
/* @name GetUserByEmail */
SELECT *
FROM auth.users
WHERE email = :email
LIMIT 1;
/* --------------------------------------------------------------------- */
/* @name GetUserByProviderAccountId */
SELECT *
FROM auth.users
WHERE raw_app_meta_data->'provider' = :providerId
  AND raw_app_meta_data->'id' = :providerAccountId
LIMIT 1;
/* --------------------------------------------------------------------- */
/* @name CreateUser */
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    email,
    role,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data
  )
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    uuid_generate_v4(),
    :aud,
    :email,
    :role,
    :emailConfirmedAt,
    :rawAppMetaData,
    :rawUserMetaData
  )
RETURNING *;
/* --------------------------------------------------------------------- */
/* @name UpdateUser */
UPDATE auth.users
SET email = COALESCE(:email, email),
  raw_user_meta_data = COALESCE(
    raw_user_meta_data || :rawAppMetaData,
    :rawAppMetaData,
    raw_user_meta_data
  )
WHERE id = :id
RETURNING *;
/* --------------------------------------------------------------------- */
/* @name DeleteUser */
DELETE FROM auth.users
WHERE id = :id
RETURNING *;
/* --------------------------------------------------------------------- */
/* @name LinkAccountUsers */
UPDATE auth.users
SET email = :email
WHERE id = :userId
RETURNING *;
/* --------------------------------------------------------------------- */
/* @name LinkAccountRefreshTokens */
INSERT INTO auth.refresh_tokens (
    instance_id,
    token,
    user_id,
    revoked,
    created_at,
    updated_at
  )
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    :token,
    :userId,
    :revoked,
    NOW(),
    NOW()
  )
RETURNING *;