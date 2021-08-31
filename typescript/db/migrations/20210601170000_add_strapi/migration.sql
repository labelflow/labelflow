--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7 (Ubuntu 12.7-1.pgdg18.04+1)
-- Dumped by pg_dump version 12.0

-- Started on 2021-08-31 17:50:55 CEST

--
-- TOC entry 7 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--


--
-- TOC entry 3256 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

--
-- TOC entry 227 (class 1259 OID 16623)
-- Name: articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE articles (
    id integer NOT NULL,
    title character varying(255),
    description text,
    content text,
    slug character varying(255),
    category integer,
    author integer,
    published_at timestamp with time zone,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 226 (class 1259 OID 16621)
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3259 (class 0 OID 0)
-- Dependencies: 226
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE articles_id_seq OWNED BY articles.id;


--
-- TOC entry 229 (class 1259 OID 16638)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 228 (class 1259 OID 16636)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3262 (class 0 OID 0)
-- Dependencies: 228
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE categories_id_seq OWNED BY categories.id;


--
-- TOC entry 223 (class 1259 OID 16604)
-- Name: components_decoration_heroes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE components_decoration_heroes (
    id integer NOT NULL,
    title character varying(255)
);



--
-- TOC entry 222 (class 1259 OID 16602)
-- Name: components_decoration_heroes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE components_decoration_heroes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3265 (class 0 OID 0)
-- Dependencies: 222
-- Name: components_decoration_heroes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE components_decoration_heroes_id_seq OWNED BY components_decoration_heroes.id;


--
-- TOC entry 225 (class 1259 OID 16612)
-- Name: components_shared_seos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE components_shared_seos (
    id integer NOT NULL,
    "metaTitle" character varying(255),
    "metaDescription" text
);



--
-- TOC entry 224 (class 1259 OID 16610)
-- Name: components_shared_seos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE components_shared_seos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3268 (class 0 OID 0)
-- Dependencies: 224
-- Name: components_shared_seos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE components_shared_seos_id_seq OWNED BY components_shared_seos.id;


--
-- TOC entry 221 (class 1259 OID 16593)
-- Name: core_store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE core_store (
    id integer NOT NULL,
    key character varying(255),
    value text,
    type character varying(255),
    environment character varying(255),
    tag character varying(255)
);



--
-- TOC entry 220 (class 1259 OID 16591)
-- Name: core_store_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE core_store_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3271 (class 0 OID 0)
-- Dependencies: 220
-- Name: core_store_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE core_store_id_seq OWNED BY core_store.id;


--
-- TOC entry 231 (class 1259 OID 16653)
-- Name: globals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE globals (
    id integer NOT NULL,
    "siteName" character varying(255) NOT NULL,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 233 (class 1259 OID 16663)
-- Name: globals_components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE globals_components (
    id integer NOT NULL,
    field character varying(255) NOT NULL,
    "order" integer NOT NULL,
    component_type character varying(255) NOT NULL,
    component_id integer NOT NULL,
    global_id integer NOT NULL
);



--
-- TOC entry 232 (class 1259 OID 16661)
-- Name: globals_components_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE globals_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3275 (class 0 OID 0)
-- Dependencies: 232
-- Name: globals_components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE globals_components_id_seq OWNED BY globals_components.id;


--
-- TOC entry 230 (class 1259 OID 16651)
-- Name: globals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE globals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3277 (class 0 OID 0)
-- Dependencies: 230
-- Name: globals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE globals_id_seq OWNED BY globals.id;


--
-- TOC entry 235 (class 1259 OID 16679)
-- Name: homepages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE homepages (
    id integer NOT NULL,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 237 (class 1259 OID 16689)
-- Name: homepages_components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE homepages_components (
    id integer NOT NULL,
    field character varying(255) NOT NULL,
    "order" integer NOT NULL,
    component_type character varying(255) NOT NULL,
    component_id integer NOT NULL,
    homepage_id integer NOT NULL
);



--
-- TOC entry 236 (class 1259 OID 16687)
-- Name: homepages_components_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE homepages_components_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3281 (class 0 OID 0)
-- Dependencies: 236
-- Name: homepages_components_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE homepages_components_id_seq OWNED BY homepages_components.id;


--
-- TOC entry 234 (class 1259 OID 16677)
-- Name: homepages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE homepages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3283 (class 0 OID 0)
-- Dependencies: 234
-- Name: homepages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE homepages_id_seq OWNED BY homepages.id;


--
-- TOC entry 261 (class 1259 OID 16843)
-- Name: i18n_locales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE i18n_locales (
    id integer NOT NULL,
    name character varying(255),
    code character varying(255),
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 260 (class 1259 OID 16841)
-- Name: i18n_locales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE i18n_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3286 (class 0 OID 0)
-- Dependencies: 260
-- Name: i18n_locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE i18n_locales_id_seq OWNED BY i18n_locales.id;


--
-- TOC entry 247 (class 1259 OID 16759)
-- Name: strapi_administrator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE strapi_administrator (
    id integer NOT NULL,
    firstname character varying(255),
    lastname character varying(255),
    username character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255),
    "resetPasswordToken" character varying(255),
    "registrationToken" character varying(255),
    "isActive" boolean,
    blocked boolean,
    "preferedLanguage" character varying(255)
);



--
-- TOC entry 246 (class 1259 OID 16757)
-- Name: strapi_administrator_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE strapi_administrator_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3289 (class 0 OID 0)
-- Dependencies: 246
-- Name: strapi_administrator_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE strapi_administrator_id_seq OWNED BY strapi_administrator.id;


--
-- TOC entry 243 (class 1259 OID 16729)
-- Name: strapi_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE strapi_permission (
    id integer NOT NULL,
    action character varying(255) NOT NULL,
    subject character varying(255),
    properties jsonb,
    conditions jsonb,
    role integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 242 (class 1259 OID 16727)
-- Name: strapi_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE strapi_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3292 (class 0 OID 0)
-- Dependencies: 242
-- Name: strapi_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE strapi_permission_id_seq OWNED BY strapi_permission.id;


--
-- TOC entry 245 (class 1259 OID 16742)
-- Name: strapi_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE strapi_role (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    description character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 244 (class 1259 OID 16740)
-- Name: strapi_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE strapi_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3295 (class 0 OID 0)
-- Dependencies: 244
-- Name: strapi_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE strapi_role_id_seq OWNED BY strapi_role.id;


--
-- TOC entry 249 (class 1259 OID 16772)
-- Name: strapi_users_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE strapi_users_roles (
    id integer NOT NULL,
    user_id integer,
    role_id integer
);



--
-- TOC entry 248 (class 1259 OID 16770)
-- Name: strapi_users_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE strapi_users_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3298 (class 0 OID 0)
-- Dependencies: 248
-- Name: strapi_users_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE strapi_users_roles_id_seq OWNED BY strapi_users_roles.id;


--
-- TOC entry 241 (class 1259 OID 16718)
-- Name: strapi_webhooks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE strapi_webhooks (
    id integer NOT NULL,
    name character varying(255),
    url text,
    headers jsonb,
    events jsonb,
    enabled boolean
);



--
-- TOC entry 240 (class 1259 OID 16716)
-- Name: strapi_webhooks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE strapi_webhooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3301 (class 0 OID 0)
-- Dependencies: 240
-- Name: strapi_webhooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE strapi_webhooks_id_seq OWNED BY strapi_webhooks.id;


--
-- TOC entry 257 (class 1259 OID 16819)
-- Name: upload_file; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE upload_file (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "alternativeText" character varying(255),
    caption character varying(255),
    width integer,
    height integer,
    formats jsonb,
    hash character varying(255) NOT NULL,
    ext character varying(255),
    mime character varying(255) NOT NULL,
    size numeric(10,2) NOT NULL,
    url character varying(255) NOT NULL,
    "previewUrl" character varying(255),
    provider character varying(255) NOT NULL,
    provider_metadata jsonb,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 256 (class 1259 OID 16817)
-- Name: upload_file_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE upload_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3304 (class 0 OID 0)
-- Dependencies: 256
-- Name: upload_file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE upload_file_id_seq OWNED BY upload_file.id;


--
-- TOC entry 259 (class 1259 OID 16832)
-- Name: upload_file_morph; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE upload_file_morph (
    id integer NOT NULL,
    upload_file_id integer,
    related_id integer,
    related_type text,
    field text,
    "order" integer
);



--
-- TOC entry 258 (class 1259 OID 16830)
-- Name: upload_file_morph_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE upload_file_morph_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3307 (class 0 OID 0)
-- Dependencies: 258
-- Name: upload_file_morph_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE upload_file_morph_id_seq OWNED BY upload_file_morph.id;


--
-- TOC entry 251 (class 1259 OID 16780)
-- Name: users-permissions_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "users-permissions_permission" (
    id integer NOT NULL,
    type character varying(255) NOT NULL,
    controller character varying(255) NOT NULL,
    action character varying(255) NOT NULL,
    enabled boolean NOT NULL,
    policy character varying(255),
    role integer,
    created_by integer,
    updated_by integer
);



--
-- TOC entry 250 (class 1259 OID 16778)
-- Name: users-permissions_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "users-permissions_permission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3310 (class 0 OID 0)
-- Dependencies: 250
-- Name: users-permissions_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "users-permissions_permission_id_seq" OWNED BY "users-permissions_permission".id;


--
-- TOC entry 253 (class 1259 OID 16791)
-- Name: users-permissions_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "users-permissions_role" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    type character varying(255),
    created_by integer,
    updated_by integer
);



--
-- TOC entry 252 (class 1259 OID 16789)
-- Name: users-permissions_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "users-permissions_role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3313 (class 0 OID 0)
-- Dependencies: 252
-- Name: users-permissions_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "users-permissions_role_id_seq" OWNED BY "users-permissions_role".id;


--
-- TOC entry 255 (class 1259 OID 16804)
-- Name: users-permissions_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "users-permissions_user" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    provider character varying(255),
    password character varying(255),
    "resetPasswordToken" character varying(255),
    "confirmationToken" character varying(255),
    confirmed boolean,
    blocked boolean,
    role integer,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 254 (class 1259 OID 16802)
-- Name: users-permissions_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "users-permissions_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3316 (class 0 OID 0)
-- Dependencies: 254
-- Name: users-permissions_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "users-permissions_user_id_seq" OWNED BY "users-permissions_user".id;


--
-- TOC entry 239 (class 1259 OID 16705)
-- Name: writers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE writers (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 238 (class 1259 OID 16703)
-- Name: writers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE writers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3319 (class 0 OID 0)
-- Dependencies: 238
-- Name: writers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE writers_id_seq OWNED BY writers.id;


--
-- TOC entry 3025 (class 2604 OID 16626)
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY articles ALTER COLUMN id SET DEFAULT nextval('articles_id_seq'::regclass);


--
-- TOC entry 3028 (class 2604 OID 16641)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq'::regclass);


--
-- TOC entry 3023 (class 2604 OID 16607)
-- Name: components_decoration_heroes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY components_decoration_heroes ALTER COLUMN id SET DEFAULT nextval('components_decoration_heroes_id_seq'::regclass);


--
-- TOC entry 3024 (class 2604 OID 16615)
-- Name: components_shared_seos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY components_shared_seos ALTER COLUMN id SET DEFAULT nextval('components_shared_seos_id_seq'::regclass);


--
-- TOC entry 3022 (class 2604 OID 16596)
-- Name: core_store id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY core_store ALTER COLUMN id SET DEFAULT nextval('core_store_id_seq'::regclass);


--
-- TOC entry 3031 (class 2604 OID 16656)
-- Name: globals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY globals ALTER COLUMN id SET DEFAULT nextval('globals_id_seq'::regclass);


--
-- TOC entry 3034 (class 2604 OID 16666)
-- Name: globals_components id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY globals_components ALTER COLUMN id SET DEFAULT nextval('globals_components_id_seq'::regclass);


--
-- TOC entry 3035 (class 2604 OID 16682)
-- Name: homepages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY homepages ALTER COLUMN id SET DEFAULT nextval('homepages_id_seq'::regclass);


--
-- TOC entry 3038 (class 2604 OID 16692)
-- Name: homepages_components id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY homepages_components ALTER COLUMN id SET DEFAULT nextval('homepages_components_id_seq'::regclass);


--
-- TOC entry 3060 (class 2604 OID 16846)
-- Name: i18n_locales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY i18n_locales ALTER COLUMN id SET DEFAULT nextval('i18n_locales_id_seq'::regclass);


--
-- TOC entry 3049 (class 2604 OID 16762)
-- Name: strapi_administrator id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_administrator ALTER COLUMN id SET DEFAULT nextval('strapi_administrator_id_seq'::regclass);


--
-- TOC entry 3043 (class 2604 OID 16732)
-- Name: strapi_permission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_permission ALTER COLUMN id SET DEFAULT nextval('strapi_permission_id_seq'::regclass);


--
-- TOC entry 3046 (class 2604 OID 16745)
-- Name: strapi_role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_role ALTER COLUMN id SET DEFAULT nextval('strapi_role_id_seq'::regclass);


--
-- TOC entry 3050 (class 2604 OID 16775)
-- Name: strapi_users_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_users_roles ALTER COLUMN id SET DEFAULT nextval('strapi_users_roles_id_seq'::regclass);


--
-- TOC entry 3042 (class 2604 OID 16721)
-- Name: strapi_webhooks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_webhooks ALTER COLUMN id SET DEFAULT nextval('strapi_webhooks_id_seq'::regclass);


--
-- TOC entry 3056 (class 2604 OID 16822)
-- Name: upload_file id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY upload_file ALTER COLUMN id SET DEFAULT nextval('upload_file_id_seq'::regclass);


--
-- TOC entry 3059 (class 2604 OID 16835)
-- Name: upload_file_morph id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY upload_file_morph ALTER COLUMN id SET DEFAULT nextval('upload_file_morph_id_seq'::regclass);


--
-- TOC entry 3051 (class 2604 OID 16783)
-- Name: users-permissions_permission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "users-permissions_permission" ALTER COLUMN id SET DEFAULT nextval('"users-permissions_permission_id_seq"'::regclass);


--
-- TOC entry 3052 (class 2604 OID 16794)
-- Name: users-permissions_role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "users-permissions_role" ALTER COLUMN id SET DEFAULT nextval('"users-permissions_role_id_seq"'::regclass);


--
-- TOC entry 3053 (class 2604 OID 16807)
-- Name: users-permissions_user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "users-permissions_user" ALTER COLUMN id SET DEFAULT nextval('"users-permissions_user_id_seq"'::regclass);


--
-- TOC entry 3039 (class 2604 OID 16708)
-- Name: writers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY writers ALTER COLUMN id SET DEFAULT nextval('writers_id_seq'::regclass);


--
-- TOC entry 3070 (class 2606 OID 16633)
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- TOC entry 3072 (class 2606 OID 16635)
-- Name: articles "articles.slug_unique"; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY articles
    ADD CONSTRAINT "articles.slug_unique" UNIQUE (slug);


--
-- TOC entry 3074 (class 2606 OID 16648)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3076 (class 2606 OID 16650)
-- Name: categories "categories.slug_unique"; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT "categories.slug_unique" UNIQUE (slug);


--
-- TOC entry 3066 (class 2606 OID 16609)
-- Name: components_decoration_heroes components_decoration_heroes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY components_decoration_heroes
    ADD CONSTRAINT components_decoration_heroes_pkey PRIMARY KEY (id);


--
-- TOC entry 3068 (class 2606 OID 16620)
-- Name: components_shared_seos components_shared_seos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY components_shared_seos
    ADD CONSTRAINT components_shared_seos_pkey PRIMARY KEY (id);


--
-- TOC entry 3064 (class 2606 OID 16601)
-- Name: core_store core_store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY core_store
    ADD CONSTRAINT core_store_pkey PRIMARY KEY (id);


--
-- TOC entry 3080 (class 2606 OID 16671)
-- Name: globals_components globals_components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY globals_components
    ADD CONSTRAINT globals_components_pkey PRIMARY KEY (id);


--
-- TOC entry 3078 (class 2606 OID 16660)
-- Name: globals globals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY globals
    ADD CONSTRAINT globals_pkey PRIMARY KEY (id);


--
-- TOC entry 3084 (class 2606 OID 16697)
-- Name: homepages_components homepages_components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY homepages_components
    ADD CONSTRAINT homepages_components_pkey PRIMARY KEY (id);


--
-- TOC entry 3082 (class 2606 OID 16686)
-- Name: homepages homepages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY homepages
    ADD CONSTRAINT homepages_pkey PRIMARY KEY (id);


--
-- TOC entry 3118 (class 2606 OID 16855)
-- Name: i18n_locales "i18n_locales.code_unique"; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY i18n_locales
    ADD CONSTRAINT "i18n_locales.code_unique" UNIQUE (code);


--
-- TOC entry 3120 (class 2606 OID 16853)
-- Name: i18n_locales i18n_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY i18n_locales
    ADD CONSTRAINT i18n_locales_pkey PRIMARY KEY (id);


--
-- TOC entry 3098 (class 2606 OID 16769)
-- Name: strapi_administrator "strapi_administrator.email_unique"; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_administrator
    ADD CONSTRAINT "strapi_administrator.email_unique" UNIQUE (email);


--
-- TOC entry 3100 (class 2606 OID 16767)
-- Name: strapi_administrator strapi_administrator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_administrator
    ADD CONSTRAINT strapi_administrator_pkey PRIMARY KEY (id);


--
-- TOC entry 3090 (class 2606 OID 16739)
-- Name: strapi_permission strapi_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_permission
    ADD CONSTRAINT strapi_permission_pkey PRIMARY KEY (id);


--
-- TOC entry 3092 (class 2606 OID 16756)
-- Name: strapi_role "strapi_role.code_unique"; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_role
    ADD CONSTRAINT "strapi_role.code_unique" UNIQUE (code);


--
-- TOC entry 3094 (class 2606 OID 16754)
-- Name: strapi_role "strapi_role.name_unique"; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_role
    ADD CONSTRAINT "strapi_role.name_unique" UNIQUE (name);


--
-- TOC entry 3096 (class 2606 OID 16752)
-- Name: strapi_role strapi_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_role
    ADD CONSTRAINT strapi_role_pkey PRIMARY KEY (id);


--
-- TOC entry 3102 (class 2606 OID 16777)
-- Name: strapi_users_roles strapi_users_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_users_roles
    ADD CONSTRAINT strapi_users_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3088 (class 2606 OID 16726)
-- Name: strapi_webhooks strapi_webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY strapi_webhooks
    ADD CONSTRAINT strapi_webhooks_pkey PRIMARY KEY (id);


--
-- TOC entry 3116 (class 2606 OID 16840)
-- Name: upload_file_morph upload_file_morph_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY upload_file_morph
    ADD CONSTRAINT upload_file_morph_pkey PRIMARY KEY (id);


--
-- TOC entry 3114 (class 2606 OID 16829)
-- Name: upload_file upload_file_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY upload_file
    ADD CONSTRAINT upload_file_pkey PRIMARY KEY (id);


--
-- TOC entry 3104 (class 2606 OID 16788)
-- Name: users-permissions_permission users-permissions_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "users-permissions_permission"
    ADD CONSTRAINT "users-permissions_permission_pkey" PRIMARY KEY (id);


--
-- TOC entry 3106 (class 2606 OID 16799)
-- Name: users-permissions_role users-permissions_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "users-permissions_role"
    ADD CONSTRAINT "users-permissions_role_pkey" PRIMARY KEY (id);


--
-- TOC entry 3108 (class 2606 OID 16801)
-- Name: users-permissions_role users-permissions_role_type_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "users-permissions_role"
    ADD CONSTRAINT "users-permissions_role.type_unique" UNIQUE (type);


--
-- TOC entry 3110 (class 2606 OID 16814)
-- Name: users-permissions_user users-permissions_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "users-permissions_user"
    ADD CONSTRAINT "users-permissions_user_pkey" PRIMARY KEY (id);


--
-- TOC entry 3112 (class 2606 OID 16816)
-- Name: users-permissions_user users-permissions_user.username_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "users-permissions_user"
    ADD CONSTRAINT "users-permissions_user.username_unique" UNIQUE (username);


--
-- TOC entry 3086 (class 2606 OID 16715)
-- Name: writers writers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY writers
    ADD CONSTRAINT writers_pkey PRIMARY KEY (id);


--
-- TOC entry 3121 (class 2606 OID 16672)
-- Name: globals_components global_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY globals_components
    ADD CONSTRAINT global_id_fk FOREIGN KEY (global_id) REFERENCES globals(id) ON DELETE CASCADE;


--
-- TOC entry 3122 (class 2606 OID 16698)
-- Name: homepages_components homepage_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY homepages_components
    ADD CONSTRAINT homepage_id_fk FOREIGN KEY (homepage_id) REFERENCES homepages(id) ON DELETE CASCADE;
