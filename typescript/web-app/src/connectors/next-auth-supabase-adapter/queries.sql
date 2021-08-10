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
    raw_user_meta_data,
    created_at,
    updated_at,
    is_super_admin
  )
VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    uuid_generate_v4(),
    :aud,
    :email,
    :role,
    :emailConfirmedAt,
    :rawAppMetaData,
    :rawUserMetaData,
    NOW(),
    NOW(),
    FALSE
  )
RETURNING *;
/* --------------------------------------------------------------------- */
/* @name UpdateUser */
UPDATE auth.users
SET email = COALESCE(:email, email),
  raw_user_meta_data = COALESCE(
    raw_user_meta_data || :rawUserMetaData,
    :rawUserMetaData,
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
/* @name LinkAccountUpdateUser */
UPDATE auth.users
SET raw_app_meta_data = COALESCE(
    raw_app_meta_data || :rawAppMetaData,
    :rawAppMetaData,
    raw_app_meta_data
  )
WHERE id = :userId
RETURNING *;
/* --------------------------------------------------------------------- */
/* @name LinkAccountCreateRefreshToken */
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
    FALSE,
    NOW(),
    NOW()
  )
RETURNING *;
/* --------------------------------------------------------------------- */
/* @name UnlinkAccountUpdateUser */
UPDATE auth.users
SET raw_app_meta_data = COALESCE(
    raw_app_meta_data || :rawAppMetaData,
    :rawAppMetaData,
    raw_app_meta_data
  )
WHERE id = :userId
RETURNING *;
/* --------------------------------------------------------------------- */
/* @name UnlinkAccountDeleteRefreshToken */
DELETE FROM auth.refresh_tokens
WHERE user_id = :userId
RETURNING *;