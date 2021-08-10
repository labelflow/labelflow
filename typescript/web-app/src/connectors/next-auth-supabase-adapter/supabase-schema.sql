/* --------------------------------------------------------------------- */
/* @name CreateTableRefreshTokens */
CREATE TABLE auth.refresh_tokens (
  instance_id uuid,
  id bigint NOT NULL DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass),
  token character varying(255) COLLATE pg_catalog."default",
  user_id character varying(255) COLLATE pg_catalog."default",
  revoked boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id)
)
/* --------------------------------------------------------------------- */
/* @name CreateTableUsers */
CREATE TABLE auth.users (
  instance_id uuid,
  id uuid NOT NULL,
  aud character varying(255) COLLATE pg_catalog."default",
  role character varying(255) COLLATE pg_catalog."default",
  email character varying(255) COLLATE pg_catalog."default",
  encrypted_password character varying(255) COLLATE pg_catalog."default",
  email_confirmed_at timestamp with time zone,
  invited_at timestamp with time zone,
  confirmation_token character varying(255) COLLATE pg_catalog."default",
  confirmation_sent_at timestamp with time zone,
  recovery_token character varying(255) COLLATE pg_catalog."default",
  recovery_sent_at timestamp with time zone,
  email_change_token character varying(255) COLLATE pg_catalog."default",
  email_change character varying(255) COLLATE pg_catalog."default",
  email_change_sent_at timestamp with time zone,
  last_sign_in_at timestamp with time zone,
  raw_app_meta_data jsonb,
  raw_user_meta_data jsonb,
  is_super_admin boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  phone character varying(15) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
  phone_confirmed_at timestamp with time zone,
  phone_change character varying(15) COLLATE pg_catalog."default" DEFAULT ''::character varying,
  phone_change_token character varying(255) COLLATE pg_catalog."default" DEFAULT ''::character varying,
  phone_change_sent_at timestamp with time zone,
  confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_phone_key UNIQUE (phone)
)