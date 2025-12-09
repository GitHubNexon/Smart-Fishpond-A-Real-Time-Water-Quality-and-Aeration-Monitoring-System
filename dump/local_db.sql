--
-- PostgreSQL database dump
--

\restrict d37zbRC6bgDdFuxAP4fxxlCSYct6qz64dgJE3qxgXcaVo9CKp1Fuen31aViqkcE

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: asset_depreciation_depreciation_method_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_depreciation_depreciation_method_enum AS ENUM (
    'STRAIGHT_LINE',
    'ACCELERATED'
);


ALTER TYPE public.asset_depreciation_depreciation_method_enum OWNER TO postgres;

--
-- Name: asset_depreciation_frequency_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_depreciation_frequency_enum AS ENUM (
    'MONTHLY',
    'QUARTERLY',
    'ANNUAL'
);


ALTER TYPE public.asset_depreciation_frequency_enum OWNER TO postgres;

--
-- Name: asset_depreciation_useful_life_unit_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_depreciation_useful_life_unit_enum AS ENUM (
    'MONTHS',
    'YEARS'
);


ALTER TYPE public.asset_depreciation_useful_life_unit_enum OWNER TO postgres;

--
-- Name: asset_transactions_fromstatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_transactions_fromstatus_enum AS ENUM (
    'New-Available',
    'Available',
    'For-Issuance',
    'Issued',
    'Returned-To-Custodian',
    'For-Repair',
    'Repaired',
    'Repair-Failed',
    'Returned-For-Disposal',
    'For-Disposal',
    'Disposed',
    'Deprecated',
    'For-Transfer',
    'Transferred',
    'Transfer-Rejected',
    'Lost',
    'Stolen',
    'Recovered'
);


ALTER TYPE public.asset_transactions_fromstatus_enum OWNER TO postgres;

--
-- Name: asset_transactions_tostatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_transactions_tostatus_enum AS ENUM (
    'New-Available',
    'Available',
    'For-Issuance',
    'Issued',
    'Returned-To-Custodian',
    'For-Repair',
    'Repaired',
    'Repair-Failed',
    'Returned-For-Disposal',
    'For-Disposal',
    'Disposed',
    'Deprecated',
    'For-Transfer',
    'Transferred',
    'Transfer-Rejected',
    'Lost',
    'Stolen',
    'Recovered'
);


ALTER TYPE public.asset_transactions_tostatus_enum OWNER TO postgres;

--
-- Name: asset_transactions_transactiontype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_transactions_transactiontype_enum AS ENUM (
    'purchase',
    'donation',
    'make_available',
    'direct_issuance',
    'request_issuance',
    'approve_issuance',
    'reject_issuance',
    'return_to_inventory',
    'request_repair',
    'return_for_repair',
    'send_to_repair',
    'complete_repair',
    'fail_repair',
    'request_disposal',
    'approve_disposal',
    'deprecate',
    'request_transfer',
    'approve_transfer',
    'reject_transfer',
    'report_lost',
    'report_stolen',
    'mark_recovered',
    'status_correction',
    'location_update'
);


ALTER TYPE public.asset_transactions_transactiontype_enum OWNER TO postgres;

--
-- Name: assets_inventory_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assets_inventory_status_enum AS ENUM (
    'New-Available',
    'Available',
    'For-Issuance',
    'Issued',
    'Returned-To-Custodian',
    'For-Repair',
    'Repaired',
    'Repair-Failed',
    'Returned-For-Disposal',
    'For-Disposal',
    'Disposed',
    'Deprecated',
    'For-Transfer',
    'Transferred',
    'Transfer-Rejected',
    'Lost',
    'Stolen',
    'Recovered'
);


ALTER TYPE public.assets_inventory_status_enum OWNER TO postgres;

--
-- Name: inventory_status_from_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.inventory_status_from_enum AS ENUM (
    'New-Available',
    'Available',
    'For-Issuance',
    'Issued',
    'Returned-To-Custodian',
    'For-Repair',
    'Repaired',
    'Repair-Failed',
    'Returned-For-Disposal',
    'For-Disposal',
    'Disposed',
    'Deprecated',
    'For-Transfer',
    'Transferred',
    'Transfer-Rejected',
    'Lost',
    'Stolen',
    'Recovered'
);


ALTER TYPE public.inventory_status_from_enum OWNER TO postgres;

--
-- Name: inventory_status_to_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.inventory_status_to_enum AS ENUM (
    'New-Available',
    'Available',
    'For-Issuance',
    'Issued',
    'Returned-To-Custodian',
    'For-Repair',
    'Repaired',
    'Repair-Failed',
    'Returned-For-Disposal',
    'For-Disposal',
    'Disposed',
    'Deprecated',
    'For-Transfer',
    'Transferred',
    'Transfer-Rejected',
    'Lost',
    'Stolen',
    'Recovered'
);


ALTER TYPE public.inventory_status_to_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid NOT NULL,
    performed_by uuid,
    before jsonb,
    after jsonb,
    action text NOT NULL,
    "transactionId" text,
    title text,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT "audit_logs_createdAt_not_null" NOT NULL,
    updated_at timestamp with time zone DEFAULT now() CONSTRAINT "audit_logs_updatedAt_not_null" NOT NULL,
    version integer
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: auth_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_logs (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid NOT NULL,
    "ipAddress" character varying(64),
    device text,
    timestamptz timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    "userId" uuid,
    version integer
);


ALTER TABLE public.auth_logs OWNER TO postgres;

--
-- Name: chat_embeddings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_embeddings (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid NOT NULL,
    message_id uuid NOT NULL,
    content text NOT NULL,
    embedding jsonb NOT NULL,
    source_table character varying(50),
    source_id integer,
    version integer,
    deleted_at timestamp with time zone
);


ALTER TABLE public.chat_embeddings OWNER TO postgres;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_messages (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid NOT NULL,
    session_id uuid NOT NULL,
    role character varying(10) NOT NULL,
    content text NOT NULL,
    metadata jsonb,
    version integer,
    deleted_at timestamp with time zone
);


ALTER TABLE public.chat_messages OWNER TO postgres;

--
-- Name: chat_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_sessions (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid NOT NULL,
    title character varying(255),
    sender_id uuid,
    version integer,
    deleted_at timestamp with time zone
);


ALTER TABLE public.chat_sessions OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id uuid NOT NULL,
    version integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    employee_id character varying(20) NOT NULL,
    first_name character varying NOT NULL,
    middle_name character varying,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    contact_number character varying(20) NOT NULL,
    "position" character varying(50) NOT NULL,
    department character varying(50) NOT NULL,
    is_verified boolean DEFAULT false NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    title text,
    description text,
    url_params character varying,
    actions text NOT NULL,
    status text NOT NULL,
    author uuid,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT "notifications_createdAt_not_null" NOT NULL,
    updated_at timestamp with time zone DEFAULT now() CONSTRAINT "notifications_updatedAt_not_null" NOT NULL,
    version integer
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    permission character varying NOT NULL,
    description character varying DEFAULT 'No description provided'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    version integer NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    role character varying NOT NULL,
    description character varying DEFAULT 'No description provided'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    version integer NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id uuid NOT NULL,
    "ipAddress" character varying(64),
    device text,
    "userId" uuid,
    "expiresAt" timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT "sessions_createdAt_not_null" NOT NULL,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() CONSTRAINT "sessions_updatedAt_not_null" NOT NULL,
    version integer
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_permissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "permissionId" uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    version integer NOT NULL,
    deleted_at timestamp without time zone,
    user_id uuid,
    permission_id uuid
);


ALTER TABLE public.user_permissions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    full_name character varying NOT NULL,
    user_name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    failed_attempts integer DEFAULT 0 NOT NULL,
    version integer,
    role_id uuid,
    profile_image text,
    pass_key character varying,
    access json,
    lockout_until timestamp with time zone,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT "users_createdAt_not_null" NOT NULL,
    updated_at timestamp with time zone DEFAULT now() CONSTRAINT "users_updatedAt_not_null" NOT NULL,
    employee_id uuid
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, performed_by, before, after, action, "transactionId", title, deleted_at, created_at, updated_at, version) FROM stdin;
019ab9dc-24aa-744a-a29b-63a11fbb5a93	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"id": "019ab9dc-24a6-71ce-aef9-e5ddc1241291", "email": "employee@mail.com", "access": ["/dashboard", "/profile", "/account", "/notifications", "/announcements", "/my-attendance", "/my-schedule", "/leave-requests", "/payslips", "/benefits", "/my-documents", "/my-performance", "/my-certificates"], "roleId": {"id": "019ab9a1-1a33-733f-aa4e-2dffc6464949", "role": "Employee", "version": 2, "createdAt": "2025-11-25T06:08:54.323Z", "deletedAt": null, "updatedAt": "2025-11-25T06:09:28.950Z", "description": "Employee"}, "passKey": "$2b$10$rraCakMEHTn1LxIygdPrsugjmRTsAmRi6gaDzR55Ld8Ugs0D.uU22", "version": 1, "fullname": "Employee Demo", "password": "$2b$10$1IbF0fuBkmkKp.WowNeKduP0PU3vPMfMcT9a0Y6W4BUnOYneImHEW", "username": "@employee-demo", "createdAt": "2025-11-25T07:13:23.622Z", "deletedAt": null, "updatedAt": "2025-11-25T07:13:23.622Z", "employeeId": null, "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	{"id": "019ab9dc-24a6-71ce-aef9-e5ddc1241291", "email": "employee@mail.com", "access": ["/dashboard", "/profile", "/account", "/notifications", "/announcements", "/my-attendance", "/my-schedule", "/leave-requests", "/payslips", "/benefits", "/my-documents", "/my-performance", "/my-certificates"], "roleId": {"id": "019ab9a1-1a33-733f-aa4e-2dffc6464949", "role": "Employee", "version": 2, "createdAt": "2025-11-25T06:08:54.323Z", "deletedAt": null, "updatedAt": "2025-11-25T06:09:28.950Z", "description": "Employee"}, "passKey": "$2b$10$rraCakMEHTn1LxIygdPrsugjmRTsAmRi6gaDzR55Ld8Ugs0D.uU22", "version": 1, "fullname": "Employee Demo", "password": "$2b$10$1IbF0fuBkmkKp.WowNeKduP0PU3vPMfMcT9a0Y6W4BUnOYneImHEW", "username": "@employee-demo", "createdAt": "2025-11-25T07:13:23.622Z", "deletedAt": null, "updatedAt": "2025-11-25T07:13:23.622Z", "employeeId": null, "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	CREATE	TX_USER-019ab9dc-24a6-71ce-aef9-e5ddc1241291	User Account Created Employee Demo	\N	2025-11-25 15:13:23.629882+08	2025-11-25 15:13:23.629882+08	1
019ab9df-f123-7569-a755-679242a7e5e9	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"id": "019ab9df-f11e-712b-827d-2a701cc0aa2d", "email": "hradmin@mail.com", "access": ["/dashboard", "/profile", "/account", "/notifications", "/announcements", "/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/employee-records", "/attendance-management", "/schedule-management", "/leave-management", "/payroll-management", "/benefits-management", "/documents-management", "/performance-management", "/certificates-management", "/reports"], "roleId": {"id": "019ab9a1-4282-722a-a846-6e7e527bb29c", "role": "HR-Administrator", "version": 2, "createdAt": "2025-11-25T06:09:04.642Z", "deletedAt": null, "updatedAt": "2025-11-25T06:09:21.383Z", "description": "HR-Administrator"}, "passKey": "$2b$10$.WiFel3cKp1U/42AD9LAW.bRy0F.kW7dv9kvbBl9eAqFo2aNVn0xi", "version": 1, "fullname": "HR Administrator", "password": "$2b$10$o3q/Pu7PT/dGIZ28WrKV/elekNbWDPVkuqWP2maogoUtGVwHaF.w6", "username": "@hr-admin", "createdAt": "2025-11-25T07:17:32.574Z", "deletedAt": null, "updatedAt": "2025-11-25T07:17:32.574Z", "employeeId": null, "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	{"id": "019ab9df-f11e-712b-827d-2a701cc0aa2d", "email": "hradmin@mail.com", "access": ["/dashboard", "/profile", "/account", "/notifications", "/announcements", "/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/employee-records", "/attendance-management", "/schedule-management", "/leave-management", "/payroll-management", "/benefits-management", "/documents-management", "/performance-management", "/certificates-management", "/reports"], "roleId": {"id": "019ab9a1-4282-722a-a846-6e7e527bb29c", "role": "HR-Administrator", "version": 2, "createdAt": "2025-11-25T06:09:04.642Z", "deletedAt": null, "updatedAt": "2025-11-25T06:09:21.383Z", "description": "HR-Administrator"}, "passKey": "$2b$10$.WiFel3cKp1U/42AD9LAW.bRy0F.kW7dv9kvbBl9eAqFo2aNVn0xi", "version": 1, "fullname": "HR Administrator", "password": "$2b$10$o3q/Pu7PT/dGIZ28WrKV/elekNbWDPVkuqWP2maogoUtGVwHaF.w6", "username": "@hr-admin", "createdAt": "2025-11-25T07:17:32.574Z", "deletedAt": null, "updatedAt": "2025-11-25T07:17:32.574Z", "employeeId": null, "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	CREATE	TX_USER-019ab9df-f11e-712b-827d-2a701cc0aa2d	User Account Created HR Administrator	\N	2025-11-25 15:17:32.582321+08	2025-11-25 15:17:32.582321+08	1
019ab9e1-5240-748f-b85c-03ba1dfc9226	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"id": "019ab9e1-523d-717d-88c1-cdaf880dcd50", "email": "hrmanager@mail.com", "access": ["/dashboard", "/profile", "/account", "/notifications", "/employee-records", "/attendance-management", "/schedule-management", "/leave-management", "/payroll-management", "/benefits-management", "/documents-management", "/performance-management", "/certificates-management", "/reports"], "roleId": {"id": "019ab9a1-6b08-703a-b9b1-c5edb3acd354", "role": "HR-Manager", "version": 1, "createdAt": "2025-11-25T06:09:15.017Z", "deletedAt": null, "updatedAt": "2025-11-25T06:09:15.017Z", "description": "HR-Manager"}, "passKey": "$2b$10$GJrBOmHO31LKXdg2IOhN7Onbi.waqZ0XH6triLqvARvFNzwZBKkLO", "version": 1, "fullname": "HR Manager", "password": "$2b$10$udtInvGRyURuImPjCjfFdOf6EXvGrni0R5kDZkl45wGkcVKSsCGGC", "username": "@hr-manager", "createdAt": "2025-11-25T07:19:02.973Z", "deletedAt": null, "updatedAt": "2025-11-25T07:19:02.973Z", "employeeId": null, "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	{"id": "019ab9e1-523d-717d-88c1-cdaf880dcd50", "email": "hrmanager@mail.com", "access": ["/dashboard", "/profile", "/account", "/notifications", "/employee-records", "/attendance-management", "/schedule-management", "/leave-management", "/payroll-management", "/benefits-management", "/documents-management", "/performance-management", "/certificates-management", "/reports"], "roleId": {"id": "019ab9a1-6b08-703a-b9b1-c5edb3acd354", "role": "HR-Manager", "version": 1, "createdAt": "2025-11-25T06:09:15.017Z", "deletedAt": null, "updatedAt": "2025-11-25T06:09:15.017Z", "description": "HR-Manager"}, "passKey": "$2b$10$GJrBOmHO31LKXdg2IOhN7Onbi.waqZ0XH6triLqvARvFNzwZBKkLO", "version": 1, "fullname": "HR Manager", "password": "$2b$10$udtInvGRyURuImPjCjfFdOf6EXvGrni0R5kDZkl45wGkcVKSsCGGC", "username": "@hr-manager", "createdAt": "2025-11-25T07:19:02.973Z", "deletedAt": null, "updatedAt": "2025-11-25T07:19:02.973Z", "employeeId": null, "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	CREATE	TX_USER-019ab9e1-523d-717d-88c1-cdaf880dcd50	User Account Created HR Manager	\N	2025-11-25 15:19:02.97914+08	2025-11-25 15:19:02.97914+08	1
019ab9e2-7d44-7538-8415-56e1ab693136	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"id": "019ab9e2-7d39-752c-a186-1acfd6d6bda7", "email": "hrstaff@mail.com", "access": ["/dashboard", "/profile", "/account", "/notifications", "/announcements", "/employee-records", "/attendance-management", "/schedule-management", "/leave-management", "/payroll-management", "/benefits-management", "/documents-management", "/performance-management", "/certificates-management", "/reports"], "roleId": {"id": "019ab9a2-e1f0-718e-bfb1-01b452e7e567", "role": "HR-Staff", "version": 1, "createdAt": "2025-11-25T06:10:50.992Z", "deletedAt": null, "updatedAt": "2025-11-25T06:10:50.992Z", "description": "HR-Staff"}, "passKey": "$2b$10$4k/.2HVkeYtKd8MkYuS7suS840cRo3OcG9uOyp24j.u8e16DXqFSC", "version": 1, "fullname": "HR Staff", "password": "$2b$10$MGalWpaC40YI8XiMNXijKuIDom7.D.KqhVIRCO9tuZe2USPPmkSe.", "username": "@hr-staff", "createdAt": "2025-11-25T07:20:19.514Z", "deletedAt": null, "updatedAt": "2025-11-25T07:20:19.514Z", "employeeId": null, "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	{"id": "019ab9e2-7d39-752c-a186-1acfd6d6bda7", "email": "hrstaff@mail.com", "access": ["/dashboard", "/profile", "/account", "/notifications", "/announcements", "/employee-records", "/attendance-management", "/schedule-management", "/leave-management", "/payroll-management", "/benefits-management", "/documents-management", "/performance-management", "/certificates-management", "/reports"], "roleId": {"id": "019ab9a2-e1f0-718e-bfb1-01b452e7e567", "role": "HR-Staff", "version": 1, "createdAt": "2025-11-25T06:10:50.992Z", "deletedAt": null, "updatedAt": "2025-11-25T06:10:50.992Z", "description": "HR-Staff"}, "passKey": "$2b$10$4k/.2HVkeYtKd8MkYuS7suS840cRo3OcG9uOyp24j.u8e16DXqFSC", "version": 1, "fullname": "HR Staff", "password": "$2b$10$MGalWpaC40YI8XiMNXijKuIDom7.D.KqhVIRCO9tuZe2USPPmkSe.", "username": "@hr-staff", "createdAt": "2025-11-25T07:20:19.514Z", "deletedAt": null, "updatedAt": "2025-11-25T07:20:19.514Z", "employeeId": null, "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	CREATE	TX_USER-019ab9e2-7d39-752c-a186-1acfd6d6bda7	User Account Created HR Staff	\N	2025-11-25 15:20:19.527667+08	2025-11-25 15:20:19.527667+08	1
019ab9e3-8016-757d-9cb0-b3766255d3a3	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"id": "019ab9e3-8011-726e-99a6-50836e8f84bc", "email": "accountant@mail.com", "access": ["/dashboard", "/profile", "/account", "/notifications", "/announcements", "/deductions", "/allowances", "/payslips-management", "/reimbursements", "/cash-advances", "/government-reports", "/tax-documents", "/financial-statements"], "roleId": {"id": "019ab9a2-faa4-70f2-8888-1b628b93598f", "role": "Accountant", "version": 1, "createdAt": "2025-11-25T06:10:57.316Z", "deletedAt": null, "updatedAt": "2025-11-25T06:10:57.316Z", "description": "Accountant"}, "passKey": "$2b$10$0vk7VGVqzUn9G8UJMloUaedofZ4zJCZKM0Q8Cq9rvForW1XaaQumG", "version": 1, "fullname": "Accountant Demo", "password": "$2b$10$NJGEPOqb7egXGUuU3i2zoOC/mpumWpI/slUXtafJQPeydKe4WOvXa", "username": "@accountant-demo", "createdAt": "2025-11-25T07:21:25.777Z", "deletedAt": null, "updatedAt": "2025-11-25T07:21:25.777Z", "employeeId": null, "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	{"id": "019ab9e3-8011-726e-99a6-50836e8f84bc", "email": "accountant@mail.com", "access": ["/dashboard", "/profile", "/account", "/notifications", "/announcements", "/deductions", "/allowances", "/payslips-management", "/reimbursements", "/cash-advances", "/government-reports", "/tax-documents", "/financial-statements"], "roleId": {"id": "019ab9a2-faa4-70f2-8888-1b628b93598f", "role": "Accountant", "version": 1, "createdAt": "2025-11-25T06:10:57.316Z", "deletedAt": null, "updatedAt": "2025-11-25T06:10:57.316Z", "description": "Accountant"}, "passKey": "$2b$10$0vk7VGVqzUn9G8UJMloUaedofZ4zJCZKM0Q8Cq9rvForW1XaaQumG", "version": 1, "fullname": "Accountant Demo", "password": "$2b$10$NJGEPOqb7egXGUuU3i2zoOC/mpumWpI/slUXtafJQPeydKe4WOvXa", "username": "@accountant-demo", "createdAt": "2025-11-25T07:21:25.777Z", "deletedAt": null, "updatedAt": "2025-11-25T07:21:25.777Z", "employeeId": null, "lockoutUntil": null, "profileImage": null, "failedAttempts": 0}	CREATE	TX_USER-019ab9e3-8011-726e-99a6-50836e8f84bc	User Account Created Accountant Demo	\N	2025-11-25 15:21:25.784717+08	2025-11-25 15:21:25.784717+08	1
019ab9e5-993f-74c8-865e-d3bc1dc417be	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"access": ["/dashboard", "/profile", "/account", "/announcements", "/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications"], "roleId": "0199799e-a53c-712a-a759-5fee5d7e0cf5"}	{"access": ["/dashboard", "/profile", "/account", "/announcements", "/admin/users", "/admin/roles", "/admin/permissions", "/admin/audit-logs", "/notifications"], "roleId": "0199799e-a53c-712a-a759-5fee5d7e0cf5"}	UPDATE	TX_USER-01997ac6-c5bb-7589-b79f-a6509ea5d44a	User Account UPDATED System Administrator	\N	2025-11-25 15:23:43.298043+08	2025-11-25 15:23:43.298043+08	1
019ab9e8-9ced-77bd-90b6-78e0f39958d3	01997ac6-c5bb-7589-b79f-a6509ea5d44a	{"roleId": "019ab9a1-4282-722a-a846-6e7e527bb29c"}	{"roleId": "019ab9a1-4282-722a-a846-6e7e527bb29c"}	UPDATE	TX_USER-019ab9df-f11e-712b-827d-2a701cc0aa2d	User Account UPDATED HR Administrator	\N	2025-11-25 15:27:00.848284+08	2025-11-25 15:27:00.848284+08	1
019ab9f0-7881-7668-9940-4ea53ece54b1	019ab9df-f11e-712b-827d-2a701cc0aa2d	{"access": ["/dashboard", "/profile", "/account", "/notifications", "/employee-records", "/attendance-management", "/schedule-management", "/leave-management", "/payroll-management", "/benefits-management", "/documents-management", "/performance-management", "/certificates-management", "/reports", "/announcements"], "roleId": "019ab9a1-6b08-703a-b9b1-c5edb3acd354"}	{"access": ["/dashboard", "/profile", "/account", "/notifications", "/employee-records", "/attendance-management", "/schedule-management", "/leave-management", "/payroll-management", "/benefits-management", "/documents-management", "/performance-management", "/certificates-management", "/reports", "/announcements"], "roleId": "019ab9a1-6b08-703a-b9b1-c5edb3acd354"}	UPDATE	TX_USER-019ab9e1-523d-717d-88c1-cdaf880dcd50	User Account UPDATED HR Manager	\N	2025-11-25 15:35:35.812553+08	2025-11-25 15:35:35.812553+08	1
\.


--
-- Data for Name: auth_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_logs (created_at, updated_at, id, "ipAddress", device, timestamptz, deleted_at, "userId", version) FROM stdin;
2025-11-25 14:07:42.896876+08	2025-11-25 14:07:42.896876+08	019ab9a0-0330-772e-88e2-7acd73bac43a	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 14:07:42.896876	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-11-25 15:00:38.929337+08	2025-11-25 15:00:38.929337+08	019ab9d0-7990-71fc-954c-fa5647969931	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:00:38.929337	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-11-25 15:24:07.026459+08	2025-11-25 15:24:07.026459+08	019ab9e5-f5f2-72c5-851e-b89387500857	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:24:07.026459	\N	019ab9dc-24a6-71ce-aef9-e5ddc1241291	1
2025-11-25 15:26:02.934395+08	2025-11-25 15:26:02.934395+08	019ab9e7-bab6-77df-9cc6-1a947f1abc9a	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:26:02.934395	\N	019ab9df-f11e-712b-827d-2a701cc0aa2d	1
2025-11-25 15:26:45.929432+08	2025-11-25 15:26:45.929432+08	019ab9e8-62a9-7698-9a7b-ee050c3c917f	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:26:45.929432	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	1
2025-11-25 15:28:02.84542+08	2025-11-25 15:28:02.84542+08	019ab9e9-8f1c-747c-a43c-bfb7891acdb6	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:28:02.84542	\N	019ab9df-f11e-712b-827d-2a701cc0aa2d	1
2025-11-25 15:33:55.052329+08	2025-11-25 15:33:55.052329+08	019ab9ee-eeeb-7360-9373-7b1e0616cec8	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:33:55.052329	\N	019ab9e1-523d-717d-88c1-cdaf880dcd50	1
2025-11-25 15:34:27.656437+08	2025-11-25 15:34:27.656437+08	019ab9ef-6e47-70dd-b2e4-fc92d038ac26	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:34:27.656437	\N	019ab9df-f11e-712b-827d-2a701cc0aa2d	1
2025-11-25 15:35:49.475192+08	2025-11-25 15:35:49.475192+08	019ab9f0-ade3-709d-a5ce-fca853c0f698	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:35:49.475192	\N	019ab9e1-523d-717d-88c1-cdaf880dcd50	1
2025-11-25 15:36:04.800486+08	2025-11-25 15:36:04.800486+08	019ab9f0-e9c0-71bc-983c-8b4eeb0dc8ee	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:36:04.800486	\N	019ab9e2-7d39-752c-a186-1acfd6d6bda7	1
2025-11-25 15:36:27.728784+08	2025-11-25 15:36:27.728784+08	019ab9f1-4350-74bd-bcdd-999828d89fc1	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:36:27.728784	\N	019ab9e3-8011-726e-99a6-50836e8f84bc	1
2025-11-25 15:47:36.799503+08	2025-11-25 15:47:36.799503+08	019ab9fb-78de-72c3-9822-0c1f30866244	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:47:36.799503	\N	019ab9df-f11e-712b-827d-2a701cc0aa2d	1
2025-11-25 15:47:54.99558+08	2025-11-25 15:47:54.99558+08	019ab9fb-bff2-7204-9298-a4ed092186e6	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-11-25 15:47:54.99558	\N	019ab9df-f11e-712b-827d-2a701cc0aa2d	1
\.


--
-- Data for Name: chat_embeddings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_embeddings (created_at, updated_at, id, message_id, content, embedding, source_table, source_id, version, deleted_at) FROM stdin;
2025-11-17 15:25:40.537867+08	2025-11-17 15:25:40.537867+08	019a90b4-8337-75f9-bfc9-eaad912acc8e	019a90b4-82ea-76db-8499-d46c052e8c01	According to the database, the custodian of the asset ASSET-0009-INV-1 is:\n\nEmployeeId: EMP0002\nFirstName: Robert\nMiddleName: \nLastName: Brown\nEmail: robert.brown2@example.com\nContactNumber: 09171234502\nPosition: Project Manager\nDepartment: Human Resources\nIsVerified: true	[0.15394108829173916, 0.38134034105627485, 0.530320428567718, 0.16421908709137736, 0.0009224928969765139, 0.0011530003449578146, 0.07916091617866898, 0.06977590536845403, 0.5657307682648639, 0.11485145826871727, 0.002304071627931645, 0.0025338848305253587, 0.002763528434721003, 0.012715172764792353, 0.0032222453781238464, 0.0034512880144128106, 0.013402285343339676, 0.003908664965594068, 0.008998061514665421, 0.004364995472649091, 0.004592730119443412, 0.00482015736486667, 0.01476944768153833, 0.005274028784402045, 0.005500442579917331, 0.005726488218901198, 0.0059521505716295916, 0.006177414534032645, 0.006402265028705611, 0.0066266870059180335, 0.006850665444621064, 0.00707418535345284, 0.007297231771741898, 0.007519789770508525, 0.0077418444534639785, 0.007963380958007537, 0.00818438445622128, 0.00840484015586256, 0.008624733301354064, 0.018566234869588888, 0.009062773096828465, 0.019003076122676835, 0.00949838656879905, 0.009715246962159755, 0.009931457093005852, 0.015008095337333858, 0.010361868725997522, 0.01057604141976057, 0.010789506236172176, 0.011002248887569977, 0.011214255134627687, 0.011425510787308156, 0.01163600170581314, 0.011845713801529711, 0.012054633037973233, 0.012262745431726852, 0.017331129900786175, 0.01267649402844799, 0.022604288233143508, 0.013086848821188978, 0.013290719172924658, 0.013493699948049057, 0.013695777560619404, 0.01875803133255227, 0.014097169257485269, 0.014296456475765424, 0.014494786801258997, 0.014692146959287885, 0.014888523740109382, 0.015083903999800353, 0.015278274661136987, 0.025193808409287487, 0.01566393521859573, 0.0158551993016217, 0.016045402161828776, 0.0210956239159364, 0.01642257336291121, 0.016609516458901435, 0.016795347843992177, 0.0267022407749039, 0.022024718651737794, 0.017346047729933957, 0.017527308647006645, 0.017707396423361502, 0.017886299005333724, 0.01806400441858614, 0.018240500768910685, 0.018415776243024474, 0.018589819109360518, 0.033345896261079075, 0.018934160505716655, 0.01910443598822152, 0.019273432769460815, 0.01944113953811405, 0.019607545069204094, 0.01977263822484844, 0.019936407955004724, 0.024959936145619026, 0.020259933382315982, 0.020419667425213606, 0.02057803473555785, 0.020735024713481716, 0.02089062685130609, 0.021044830734242962, 0.021197626041092564, 0.026210095392342914, 0.021498950113810672, 0.03136964440622398, 0.031516704092537276, 0.03166230502454478, 0.026945344609452127, 0.02222690604757226, 0.022368072638153703, 0.02250774208520217, 0.02264590504033916, 0.02278255225601894, 0.022917674586147487, 0.02305126298669469, 0.028044401363708362, 0.02331380233686916, 0.023442735714169275, 0.02357010001840988, 0.023695886724822323, 0.02382008741422999, 0.02394269377361183, 0.024063697596658728, 0.02418309078432282, 0.02430086534535954, 0.024417013396862513, 0.02453152716479117, 0.024644398984491084, 0.024755621301206968, 0.029726279517997053, 0.04441745914882266, 0.025079317344951876, 0.034906054012521795, 0.025286733679622295, 0.025387906545704265, 0.02548738014423129, 0.02558514781722005, 0.03540338871568593, 0.025775539325993864, 0.02586815041846301, 0.02595903009961498, 0.02604817228667595, 0.026135571013166332, 0.026221220429300113, 0.02630511480237644, 0.026387248517163266, 0.02646761607627323, 0.050851676337575154, 0.026623031329336237, 0.026698068621009898, 0.026771318953144156, 0.02684277742293568, 0.026912439247514363, 0.02698029976426346, 0.036768540125949066, 0.027110598826937046, 0.027173028651663152, 0.027233639726746625, 0.027292427995356965, 0.027349389522668074, 0.02740452049612159, 0.03231891007309081, 0.027509276144084084, 0.03241998665447944, 0.03246775974103311, 0.027652592206188983, 0.02769666667088388, 0.027738887337709735, 0.05694580846519818, 0.027817756098339575, 0.027854398913286647, 0.027889177373004167, 0.027922089149694528, 0.02795313204050125, 0.027982303967656448, 0.028009602978619864, 0.037757212941027025, 0.02805857506872435, 0.028080244870057395, 0.028100035199802007, 0.028117944733348558, 0.028133972271973194, 0.02814811674291805, 0.028160377199463068, 0.028170752820989336, 0.028179242913034044, 0.03304693975474565, 0.028190564361878407, 0.02819339496090898, 0.02819433851497054, 0.02819339496090898, 0.028190564361878407, 0.028185846907336942, 0.03304033576044276, 0.028170752820989336, 0.03302147004687178, 0.033009209590326764, 0.028133972271973194, 0.028117944733348558, 0.028100035199802007, 0.028080244870057395, 0.02805857506872435, 0.02803502724620959, 0.028009602978619864, 0.027982303967656448, 0.027953132040501254, 0.027922089149694525, 0.027889177373004167, 0.027854398913286647, 0.03267884894574829, 0.027779251380745898, 0.02773888733770974, 0.02769666667088388, 0.027652592206188983, 0.02760666689362439, 0.02755889380707072, 0.027509276144084084, 0.03231891007309081, 0.027404520496121593, 0.027349389522668074, 0.027292427995356968, 0.027233639726746625, 0.027173028651663152, 0.02711059882693705, 0.027046354431131642, 0.02698029976426346, 0.036634624942331794, 0.026842777422935678, 0.026771318953144156, 0.0266980686210099, 0.026623031329336237, 0.03140730494794029, 0.02646761607627323, 0.02638724851716327, 0.02630511480237644, 0.02622122042930012, 0.026135571013166332, 0.02604817228667595, 0.025959030099614984, 0.025868150418463003, 0.025775539325993864, 0.025681203020868494, 0.02558514781722005, 0.030348472991640008, 0.025387906545704265, 0.030147826527031008, 0.025183868317704364, 0.02507931734495188, 0.024973087759187804, 0.02972627951799706, 0.02475562130120697, 0.024644398984491084, 0.024531527164791175, 0.024417013396862516, 0.02430086534535954, 0.02418309078432282, 0.02406369759665873, 0.02394269377361183, 0.02382008741423, 0.02369588672482233, 0.028431192865818595, 0.02344273571416928, 0.023313802336869163, 0.023183308516299645, 0.027912355834103404, 0.02291767458614749, 0.022782552256018936, 0.022645905040339163, 0.027368834932610882, 0.022368072638153703, 0.022226906047572263, 0.022084251762043414, 0.02194011932972735, 0.026655611245128576, 0.021647458711406563, 0.021498950113810675, 0.021349002544934197, 0.021197626041092568, 0.021044830734242966, 0.020890626851306087, 0.025596117560890433, 0.020578034735557842, 0.020419667425213606, 0.020259933382315985, 0.02009884329821031, 0.019936407955004728, 0.019772638224848444, 0.019607545069204094, 0.029163325232931487, 0.019273432769460825, 0.019104435988221525, 0.018934160505716658, 0.018762617718852938, 0.01858981910936052, 0.01841577624302447, 0.01824050076891069, 0.01806400441858614, 0.017886299005333724, 0.022568489270770216, 0.01752730864700664, 0.017346047729933957, 0.0220247186517378, 0.01698005508008647, 0.026517533538809607, 0.016609516458901442, 0.01642257336291121, 0.01623453106852769, 0.016045402161828783, 0.015855199301621707, 0.030247213760821866, 0.01547162271447006, 0.015278274661136978, 0.015083903999800353, 0.019749616587518098, 0.014692146959287883, 0.014494786801259001, 0.014296456475765431, 0.018958262104893982, 0.023619124179960982, 0.018556870408028125, 0.013493699948049059, 0.013290719172924664, 0.013086848821188988, 0.012882102538326085, 0.012676494028448, 0.012470037053377464, 0.01226274543172686, 0.012054633037973229, 0.011845713801529713, 0.031080373095447995, 0.011425510787308158, 0.011214255134627694, 0.01586334173497869, 0.015650599083580893, 0.010576041419760578, 0.015222961573406236, 0.010147002489925153, 0.009931457093005863, 0.009715246962159757, 0.009498386568799057, 0.014141983275268121, 0.009062773096828472, 0.008844049174771454, 0.00862473330135407, 0.013265933003271271, 0.008184384456221282, 0.007963380958007542, 0.007741844453463976, 0.0075197897705085275, 0.007297231771741906, 0.00707418535345284, 0.00685066544462107, 0.006626687005918044, 0.006402265028705612, 0.006177414534032651, 0.005952150571629604, 0.010587581066309915, 0.010361535427326055, 0.0247184001740369, 0.0050472619867208985, 0.00482015736486667, 0.004592730119443417, 0.014087181167466515, 0.004136968667256709, 0.003908664965594074, 0.0036800996485222485, 0.0034512880144128145, 0.0032222453781238555, 0.0029929870699749272, 0.0027635284347210095, 0.0025338848305253695, 0.002304071627931649, 0.006935197056243825, 0.0018439979654530198, 0.011335953994111919, 0.0013834306201295516, 0.006014093192366531, 0.005783585744385224, 0.0006919237045482406, 0.0004613082001682739, 0.00023066181943163396]	\N	\N	1	\N
2025-11-17 15:26:34.848424+08	2025-11-17 15:26:34.848424+08	019a90b5-575f-752e-af5d-c2a7140bf853	019a90b5-5700-71cb-a52d-37931dc6c125	According to the database, the current status of the asset ASSET-0007-INV-7 is:\n\nStatus: Available	[0.06065504522283972, 0.35304272598623676, 0.4956495638454918, 0.06265236723038813, 0.0010125395143901375, 0.0012655473155420613, 0.06341137369948395, 0.07124291801196826, 0.6209530276622265, 0.0022765622101715796, 0.002528977268998308, 0.0027812230579006858, 0.0030332826935219005, 0.0032851393049647807, 0.0035367760349210033, 0.019261401862952377, 0.004039322495853213, 0.004290198590306459, 0.004540787532478926, 0.004791072549910141, 0.005041036890481972, 0.005290663823539879, 0.005539936641012743, 0.005788838658531168, 0.0060373532165441945, 0.006285463681434376, 0.006533153446631084, 0.006780405933722043, 0.007027204593562936, 0.0072735329073850925, 0.007519374387901122, 0.0077647125804084375, 0.008009531063890605, 0.00825381345211645, 0.008497543394736806, 0.008740704578378888, 0.008983280727738185, 0.009225255606667796, 0.00946661301926515, 0.009707336810956037, 0.009947410869575858, 0.010186819126448067, 0.041371997201765646, 0.010663574184133736, 0.010900889074698916, 0.011137474345155742, 0.07326621744895177, 0.01160839273498166, 0.011842694334763289, 0.012076203277371312, 0.012308903933546616, 0.012540780728130432, 0.012771818141106846, 0.013002000708641565, 0.01323131302411695, 0.013459739739163219, 0.01368726556468575, 0.013913875271888396, 0.014139553693292804, 0.014364285723753591, 0.014588056321469367, 0.014810850508989518, 0.015032653374216682, 0.015253450071404844, 0.015473225822152986, 0.01569196591639426, 0.01590965571338054, 0.01612628064266237, 0.016341826205064205, 0.016556277973654842, 0.016769621594713093, 0.047928294432994435, 0.03266615317330991, 0.01740286115377169, 0.03308485596736179, 0.01781922035210763, 0.018025617880006155, 0.01823080891427094, 0.01843477972102179, 0.04958396829235694, 0.01883900612573698, 0.01903923466795282, 0.019238188872968628, 0.019435855424348687, 0.01963222109184272, 0.019827272732271427, 0.0200209972904062, 0.020213381799842917, 0.02040441338386979, 0.020594079256329296, 0.020782366722473914, 0.02096926317981587, 0.02115475611897059, 0.02133883312449404, 0.021521481875713677, 0.021702690147553105, 0.021882445811350338, 0.0220607368356696, 0.022237551287106583, 0.02241287733108723, 0.022586703232659794, 0.022759017357280312, 0.022929808171591338, 0.02309906424419387, 0.023266774246412485, 0.023432926953053636, 0.02359751124315688, 0.05470696774504533, 0.023921930615532976, 0.0240817439837148, 0.024239945508630054, 0.02439652460150813, 0.024551470782171333, 0.024704773679736294, 0.024856423033308147, 0.05595286033697329, 0.025154720618948852, 0.025301348885314424, 0.040919509499769656, 0.025589515295056143, 0.025731034150830556, 0.025870830772776472, 0.0260088958040033, 0.026145220003519563, 0.02627979424685142, 0.02641260952665338, 0.026543656953311203, 0.026672927755536868, 0.026800413280955688, 0.02692610499668542, 0.027049994489907383, 0.02717207346842955, 0.04276555958339454, 0.0583572189633676, 0.027527366214875296, 0.043115348466619, 0.027755028926937472, 0.027866077505227724, 0.02797526094661498, 0.02808257194321511, 0.028188003312470754, 0.028291547997632092, 0.028393199068229152, 0.028492949720535683, 0.028590793278024548, 0.028686723191814593, 0.028780733041108973, 0.028872816533624942, 0.028962967506014948, 0.029051179924279233, 0.09103035117278159, 0.029221765611584797, 0.029304127462956683, 0.02938452792562824, 0.029462961618222424, 0.029539423291002353, 0.02961390782622273, 0.029686410238472325, 0.02975692567500771, 0.029825449416078034, 0.02989197687524095, 0.029956503599669553, 0.030019025270450483, 0.03007953770287293, 0.03013803684670878, 0.030194518786483666, 0.03024897974173907, 0.030301416067285328, 0.03035182425344565, 0.030400200926290984, 0.030446542847865875, 0.03049084691640517, 0.03053311016654163, 0.03057332976950443, 0.030611503033308445, 0.030647627402934485, 0.030681700460500266, 0.03071371992542228, 0.030743683654568407, 0.030771589642401377, 0.030797436021113, 0.030821221060749193, 0.030842943169325752, 0.03086260089293491, 0.030880192915842673, 0.03089571806057685, 0.030909175288005897, 0.030920563697408438, 0.030929882526533573, 0.030937131151651892, 0.03094230908759723, 0.030945415987799107, 0.030946451644305976, 0.030945415987799107, 0.03094230908759723, 0.030937131151651892, 0.04640310834868656, 0.030920563697408438, 0.030909175288005897, 0.03089571806057685, 0.030880192915842673, 0.03086260089293491, 0.030842943169325752, 0.06176767270505518, 0.030797436021113, 0.030771589642401377, 0.030743683654568407, 0.03071371992542228, 0.03068170046050027, 0.03064762740293448, 0.030611503033308445, 0.03057332976950443, 0.03053311016654163, 0.03049084691640517, 0.030446542847865878, 0.030400200926290984, 0.03035182425344565, 0.030301416067285328, 0.03024897974173907, 0.030194518786483666, 0.03013803684670878, 0.030079537702872933, 0.030019025270450483, 0.02995650359966956, 0.02989197687524095, 0.029825449416078034, 0.029756925675007713, 0.029686410238472325, 0.02961390782622273, 0.029539423291002356, 0.02946296161822242, 0.02938452792562824, 0.029304127462956686, 0.029221765611584797, 0.02913744788416963, 0.029051179924279233, 0.028962967506014955, 0.028872816533624942, 0.028780733041108977, 0.028686723191814593, 0.028590793278024548, 0.02849294972053569, 0.04386642489038213, 0.028291547997632092, 0.028188003312470754, 0.02808257194321511, 0.027975260946614983, 0.027866077505227724, 0.027755028926937472, 0.02764212264446601, 0.0275273662148753, 0.02741076731906162, 0.027292333761241558, 0.027172073468429554, 0.027049994489907383, 0.026926104996685424, 0.02680041328095569, 0.026672927755536868, 0.026543656953311203, 0.026412609526653384, 0.02627979424685142, 0.02614522000351957, 0.026008895804003306, 0.025870830772776476, 0.02573103415083056, 0.025589515295056146, 0.02544628367761667, 0.025301348885314424, 0.025154720618948856, 0.02500640869266731, 0.02485642303330815, 0.024704773679736298, 0.024551470782171333, 0.055342976245814114, 0.024239945508630054, 0.0240817439837148, 0.023921930615532987, 0.02376051610073936, 0.023597511243156885, 0.023432926953053636, 0.023266774246412488, 0.023099064244193872, 0.022929808171591334, 0.022759017357280316, 0.022586703232659787, 0.02241287733108723, 0.02223755128710659, 0.022060736835669593, 0.021882445811350345, 0.021702690147553112, 0.021521481875713677, 0.02133883312449405, 0.021154756118970604, 0.020969263179815872, 0.02078236672247392, 0.020594079256329296, 0.020404413383869797, 0.020213381799842913, 0.020020997290406208, 0.019827272732271427, 0.01963222109184272, 0.01943585542434869, 0.019238188872968624, 0.019039234667952824, 0.01883900612573699, 0.018637516648050963, 0.018434779721021796, 0.018230808914270952, 0.018025617880006155, 0.017819220352107635, 0.0330848559673618, 0.017402861153771695, 0.017192927351156923, 0.016981842788688455, 0.016769621594713083, 0.016556277973654842, 0.016341826205064205, 0.01612628064266237, 0.015909655713380544, 0.015691965916394268, 0.015473225822152986, 0.015253450071404847, 0.01503265337421669, 0.01481085050898952, 0.014588056321469374, 0.014364285723753601, 0.01413955369329281, 0.013913875271888407, 0.01368726556468575, 0.013459739739163224, 0.013231313024116948, 0.013002000708641567, 0.012771818141106844, 0.012540780728130434, 0.012308903933546621, 0.01207620327737131, 0.01184269433476329, 0.011608392734981668, 0.011373314160339815, 0.04208392598946173, 0.010900889074698926, 0.01066357418413374, 0.010425545557459677, 0.01018681912644807, 0.009947410869575865, 0.009707336810956032, 0.009466613019265154, 0.024698481428820782, 0.008983280727738187, 0.008740704578378894, 0.008497543394736802, 0.008253813452116454, 0.008009531063890614, 0.0077647125804084375, 0.007519374387901129, 0.007273532907385104, 0.007027204593562938, 0.00678040593372205, 0.0065331534466310974, 0.00628546368143438, 0.006037353216544206, 0.00578883865853117, 0.005539936641012739, 0.005290663823539879, 0.005041036890481976, 0.035737524194216115, 0.004540787532478927, 0.0042901985903064654, 0.004039322495853213, 0.0037881760407993937, 0.0035367760349210133, 0.003285139304964782, 0.0030332826935219074, 0.0027812230579006983, 0.002528977268998312, 0.01774978803232458, 0.0020239947761069186, 0.001771291871689548, 0.0015184704108719938, 0.0012655473155420655, 0.016485765336543123, 0.0007594639417761689, 0.0005063375365961916, 0.00025317724114855527]	\N	\N	1	\N
2025-11-17 15:27:24.230545+08	2025-11-17 15:27:24.230545+08	019a90b6-1845-73bb-9aec-cb4680a1ebba	019a90b6-17f5-75ef-a6fd-ab8f5a534998	According to the database, the current status of the asset ASSET-0007-INV-2 is:\n\nStatus: For-Transfer	[0.06258982445170673, 0.347286183143931, 0.4962679550185819, 0.06273053469727315, 0.0010138027970474364, 0.0012671262603170497, 0.0634904881315941, 0.07540137097422941, 0.621727752183783, 0.0022794025354304945, 0.002532132516847132, 0.0027846930171518485, 0.003037067131923516, 0.0032892379692161925, 0.003541188650689739, 0.0037929023127395213, 0.004044362107625128, 0.004295551204598028, 0.0045464527910280845, 0.004797050073528869, 0.0050473262790816705, 0.0052972646561581516, 0.005546848475841571, 0.00579606103294648, 0.0060448856471368335, 0.006293305664042453, 0.006541304456373725, 0.006788865425034514, 0.00703597200023317, 0.007282607642591576, 0.007528755844252181, 0.007774400129982885, 0.008019524058279772, 0.008264111222467585, 0.008508145251797843, 0.008751609812544579, 0.008994488609097595, 0.009236765385053159, 0.009478423924302077, 0.009719448052115082, 0.009959821636225425, 0.010199528587908674, 0.04142361447281535, 0.010676878463265748, 0.010914489436878855, 0.011151369880081924, 0.07335762715746562, 0.011622875805531306, 0.011857469728865127, 0.012091270006076224, 0.012324260988405826, 0.012556427081263009, 0.012787752745268496, 0.01301822249729473, 0.013247820911502192, 0.013476532620371892, 0.013704342315733956, 0.013931234749792212, 0.014157194736144787, 0.014382207150800548, 0.014606256933191382, 0.01482932908718024, 0.015051408682064862, 0.015272480853577118, 0.015492530804877901, 0.015711543807547523, 0.0159295052025715, 0.01614640040132175, 0.031854745691410884, 0.016576934213274424, 0.016790544009916638, 0.04798809158884922, 0.032706908703536666, 0.017424573622638825, 0.03312613388705658, 0.017841452286484, 0.018048107323757518, 0.01825355436213013, 0.01845777965058673, 0.049645831129642375, 0.018862510383478196, 0.019062988738408785, 0.01926219116622797, 0.01946010433388595, 0.01965671499462588, 0.019852009988870545, 0.02004597624510313, 0.02023860078074213, 0.020429870703010295, 0.020619773209797597, 0.020808295590518083, 0.02099542522696062, 0.021181149594133464, 0.021365456261102596, 0.02154833289182374, 0.021729767245968024, 0.02190974717974129, 0.02208826064669689, 0.02226529569854194, 0.022440840485937124, 0.02261488325928973, 0.02278741236954009, 0.022958416268941306, 0.023127883511832127, 0.023295802755403053, 0.023462162760455554, 0.023626952392154264, 0.05477522223052816, 0.02395177652242967, 0.02411178927982402, 0.02427018818295508, 0.02442696262984129, 0.024582102127229485, 0.02473559629129719, 0.024887434848347656, 0.05602266924525332, 0.02518610460135694, 0.02533291580670251, 0.04097056223002026, 0.025621441743773947, 0.02576313716383414, 0.025903108201341667, 0.026041345487731918, 0.026177839770484018, 0.02631258191374008, 0.02644556289891671, 0.026576773825308642, 0.026706205910684472, 0.02683385049187448, 0.026959699025350475, 0.027083743087797624, 0.027205974376678245, 0.04281891551566542, 0.05843002764055688, 0.0275617103998144, 0.04316914080875202, 0.027789657152500945, 0.027900844279204445, 0.02801016394198949, 0.028117608823854362, 0.028223171733280462, 0.028326845604713703, 0.028428623499037402, 0.028528498604036712, 0.028626464234854616, 0.02872251383443932, 0.02881664097398316, 0.02890883935335289, 0.028999102801511342, 0.0290874252769305, 0.09114392408750746, 0.02925822379340203, 0.02934068840253989, 0.02942118917587458, 0.02949972072531503, 0.029576277794574602, 0.0296508552595229, 0.029723448128528705, 0.029794051542794124, 0.02986266077667977, 0.02992927123802107, 0.029993878468435608, 0.06104153975337739, 0.030117066073647177, 0.03017563820323106, 0.030232190612013782, 0.030286719514820166, 0.03033922126191268, 0.03038969233923572, 0.030438129368650802, 0.03048452910816267, 0.030528888452136294, 0.030571204431504732, 0.03061147421396787, 0.03064969510418197, 0.030685864543940095, 0.03071998011234332, 0.0307520395259628, 0.030782040638992557, 0.030809981443393142, 0.030835860069026014, 0.03085967478377873, 0.030881423993680872, 0.03090110624301072, 0.03091872021439272, 0.030934264728885625, 0.030947738746061427, 0.030959141364074978, 0.030968471819724366, 0.03097572948850199, 0.03098091388463637, 0.030984024661124644, 0.030985061609755806, 0.030984024661124644, 0.03098091388463637, 0.03097572948850199, 0.04646100262460227, 0.030959141364074978, 0.030947738746061427, 0.030934264728885625, 0.03091872021439272, 0.03090110624301072, 0.030881423993680872, 0.06184473639353454, 0.030835860069026014, 0.030809981443393142, 0.030782040638992557, 0.0307520395259628, 0.030719980112343323, 0.030685864543940088, 0.03064969510418197, 0.03061147421396787, 0.030571204431504732, 0.030528888452136294, 0.030484529108162677, 0.030438129368650802, 0.03038969233923572, 0.03033922126191268, 0.030286719514820166, 0.030232190612013782, 0.03017563820323106, 0.03011706607364718, 0.03005647814362158, 0.02999387846843561, 0.02992927123802107, 0.02986266077667977, 0.029794051542794128, 0.029723448128528705, 0.0296508552595229, 0.029576277794574606, 0.029499720725315027, 0.02942118917587458, 0.029340688402539894, 0.02925822379340203, 0.029173800867995838, 0.0290874252769305, 0.028999102801511346, 0.02890883935335289, 0.028816640973983166, 0.02872251383443932, 0.028626464234854616, 0.028528498604036716, 0.04392115430391529, 0.028326845604713703, 0.028223171733280462, 0.028117608823854362, 0.028010163941989498, 0.027900844279204445, 0.027789657152500945, 0.027676610003874117, 0.027561710399814407, 0.027444966030801068, 0.027326384710787518, 0.02720597437667825, 0.027083743087797624, 0.02695969902535048, 0.026833850491874485, 0.042198736715562374, 0.026576773825308642, 0.026445562898916714, 0.02631258191374008, 0.02617783977048403, 0.026041345487731928, 0.02590310820134167, 0.025763137163834143, 0.025621441743773954, 0.02547803142514236, 0.02533291580670251, 0.025186104601356948, 0.02503760763549751, 0.02488743484834766, 0.024735596291297193, 0.024582102127229485, 0.024426962629841297, 0.02427018818295508, 0.02411178927982402, 0.023951776522429677, 0.02379016062077235, 0.023626952392154267, 0.023462162760455554, 0.02329580275540306, 0.023127883511832134, 0.022958416268941302, 0.022787412369540093, 0.02261488325928972, 0.022440840485937124, 0.022265295698541947, 0.022088260646696882, 0.021909747179741295, 0.02172976724596803, 0.02154833289182374, 0.021365456261102606, 0.02118114959413348, 0.020995425226960622, 0.020808295590518087, 0.020619773209797597, 0.0204298707030103, 0.020238600780742123, 0.020045976245103132, 0.019852009988870545, 0.01965671499462588, 0.019460104333885953, 0.019262191166227963, 0.019062988738408785, 0.018862510383478203, 0.018660769519886572, 0.018457779650586734, 0.01825355436213014, 0.018048107323757518, 0.017841452286484007, 0.01763360308217869, 0.01742457362263883, 0.01721437789865876, 0.017003029979093413, 0.016790544009916628, 0.016576934213274424, 0.016362214886532982, 0.016146400401321745, 0.015929505202571505, 0.01571154380754753, 0.015492530804877901, 0.015272480853577124, 0.01505140868206487, 0.014829329087180241, 0.014606256933191389, 0.014382207150800559, 0.014157194736144794, 0.013931234749792222, 0.013704342315733956, 0.013476532620371899, 0.01324782091150219, 0.013018222497294731, 0.012787752745268494, 0.01255642708126301, 0.012324260988405833, 0.012091270006076222, 0.011857469728865129, 0.011622875805531315, 0.011387503937954, 0.04213643148983774, 0.010914489436878866, 0.01067687846326575, 0.01043855286305955, 0.010199528587908676, 0.009959821636225432, 0.009719448052115076, 0.00947842392430208, 0.02472929618993106, 0.008994488609097597, 0.008751609812544584, 0.00850814525179784, 0.008264111222467589, 0.00801952405827978, 0.007774400129982885, 0.007528755844252187, 0.007282607642591588, 0.007035972000233171, 0.006788865425034522, 0.006541304456373737, 0.006293305664042457, 0.006044885647136845, 0.005796061032946482, 0.005546848475841567, 0.0052972646561581516, 0.005047326279081675, 0.03578211168328467, 0.004546452791028086, 0.004295551204598034, 0.004044362107625128, 0.0037929023127395256, 0.0035411886506897493, 0.0032892379692161943, 0.003037067131923523, 0.0027846930171518606, 0.002532132516847136, 0.01777193334030841, 0.0020265199886668056, 0.0017735018025324617, 0.001520364912082479, 0.0012671262603170536, 0.016506333601925334, 0.000760411477761535, 0.0005069692624889897, 0.00025349311466600356]	\N	\N	1	\N
2025-11-17 15:27:55.640368+08	2025-11-17 15:27:55.640368+08	019a90b6-92f8-73d8-b159-12e9c6aa565f	019a90b6-9296-7529-bbff-28909760ce9a	According to the database, the custodian of the asset ASSET-0007-INV-2 is:\n\nEmployeeId: EMP0005\nFirstName: Sophia\nMiddleName: \nLastName: Patel\nEmail: sophia.patel5@example.com\nContactNumber: 09171234505\nPosition: IT Support\nDepartment: IT\nIsVerified: true	[0.1445118035431614, 0.3838528951690204, 0.5290324341285108, 0.14804075992538238, 0.0009271164056574392, 0.0011587791505415696, 0.08857697280832375, 0.07718358380384883, 0.5685661951030672, 0.11542709057554885, 0.0023156195706942728, 0.002546584590652289, 0.0027773791621897932, 0.013906313896788342, 0.0032383951821241324, 0.003468585773720563, 0.01459687026442293, 0.003928255085429661, 0.020505192127472937, 0.004386872708263738, 0.004615748754758644, 0.004844315859195385, 0.005072558723082768, 0.005300462069631724, 0.010977173674308782, 0.005755189218202204, 0.005981982584351099, 0.006208375563453451, 0.006434353002536979, 0.006659899776442398, 0.006885000788835781, 0.00710964097321898, 0.00733380529393806, 0.00755747874718968, 0.007780646362025314, 0.008003293201353298, 0.008225404362938603, 0.00844696498040027, 0.00866796022420645, 0.019786701361728918, 0.009108195462923399, 0.009327405991936445, 0.020444318276532723, 0.009763939509077026, 0.009981233279071076, 0.015647022013041384, 0.010413802123167601, 0.010629048244500743, 0.010843582940620893, 0.01105739185225632, 0.01127046066871364, 0.011482775128835623, 0.011694321021955754, 0.01190508418884937, 0.012115050522681362, 0.012324205969950389, 0.012532536531429508, 0.012740028263103153, 0.023844993336162416, 0.013152439742624837, 0.013357331886879594, 0.013561329995989897, 0.013764420415920606, 0.013966589553390188, 0.014167823876780528, 0.014368109917042658, 0.014567434268598236, 0.014765783590236847, 0.014963144606008918, 0.015159504106114339, 0.015354848947786617, 0.026447492115234478, 0.015742442425207285, 0.015934665118485018, 0.02157498429965565, 0.016315898085631126, 0.016504882842751558, 0.01669276289232699, 0.016879525659138906, 0.027963484701812882, 0.022698812447876547, 0.017432985637555735, 0.017615155029291316, 0.01779614540056049, 0.017975944637285825, 0.018154540705115112, 0.018331921650226835, 0.018508075600130278, 0.01868299076446015, 0.035204144524358716, 0.01902905799029473, 0.0192001868887707, 0.019370030677166004, 0.019538577987468136, 0.01970581753844069, 0.019871738136378395, 0.020036328675856387, 0.036547067229066414, 0.02036147560358957, 0.02052201022905688, 0.020681171271945353, 0.02083894807926176, 0.020995330090662786, 0.0211503068391618, 0.02130386795182946, 0.021456003150488033, 0.021606702252399242, 0.0435526072890698, 0.02190375191630705, 0.022050082596126477, 0.02764410044570593, 0.02233830668100573, 0.0224801807946035, 0.022620550261026648, 0.02275940568504286, 0.02289673777275796, 0.023032537332237955, 0.023166795274124314, 0.028748665641773245, 0.02343065046420237, 0.023560230051994903, 0.023688232702577496, 0.023814649848455594, 0.02393947302825591, 0.024062693887292756, 0.024184304178127232, 0.02430429576111926, 0.02442266060497239, 0.024539390787271336, 0.02465447849501226, 0.024767916025125687, 0.024879695784992117, 0.030438973322481164, 0.03599657823785943, 0.025205014184283763, 0.0362084152226588, 0.02541347008384087, 0.025515150025506986, 0.025615122182936545, 0.025713379864776603, 0.0367082425534897, 0.025904725610484354, 0.025997800867166996, 0.02608913603474721, 0.026178724999964487, 0.026266561766435395, 0.02635264045505497, 0.026436955304390213, 0.026519500671065697, 0.026600271030141304, 0.05392507612313688, 0.026756465220119752, 0.02683187859660727, 0.026905496057364, 0.026977312675013885, 0.027047323642715212, 0.027115524274482335, 0.02718191000549928, 0.027246476392425355, 0.02730921911369247, 0.02737013396979445, 0.027429216883568072, 0.027486463900466, 0.027541871188821437, 0.03304459806963558, 0.027647151869170973, 0.02769701821450118, 0.03319419376796374, 0.027791186227383552, 0.02783548159206672, 0.027877913867697612, 0.027918480214192142, 0.0279571779163569, 0.03344316741360188, 0.028028957152458917, 0.028062033882056484, 0.028093232358966467, 0.028122550495007264, 0.028149986327852546, 0.028175538021162613, 0.028199203864707312, 0.028220982274480493, 0.028240871792806037, 0.028258871088435413, 0.028274978956636793, 0.028289194319275686, 0.028301516224887087, 0.02831194384873918, 0.028320476492888515, 0.03377627661575772, 0.02833185468451885, 0.028334699470432847, 0.02833564775356106, 0.028334699470432847, 0.02833185468451885, 0.028327113586226745, 0.03376963952241949, 0.02831194384873918, 0.028301516224887087, 0.03373835734880666, 0.028274978956636793, 0.028258871088435413, 0.028240871792806037, 0.028220982274480493, 0.028199203864707312, 0.028175538021162613, 0.03904831238691449, 0.028122550495007264, 0.02809323235896647, 0.02806203388205648, 0.028028957152458917, 0.027994004384070903, 0.033406340945887875, 0.027918480214192142, 0.027877913867697616, 0.02783548159206672, 0.027791186227383552, 0.027745030738432767, 0.02769701821450118, 0.027647151869170973, 0.03304459806963558, 0.02754187118882144, 0.027486463900466, 0.027429216883568076, 0.02737013396979445, 0.02730921911369247, 0.027246476392425358, 0.02718191000549928, 0.027115524274482335, 0.03794564970177717, 0.02697731267501388, 0.026905496057364, 0.026831878596607274, 0.026756465220119752, 0.026679260975482014, 0.026600271030141304, 0.0265195006710657, 0.026436955304390213, 0.026352640455054973, 0.026266561766435395, 0.026178724999964487, 0.026089136034747218, 0.03144696389669796, 0.025904725610484354, 0.02580991649442775, 0.025713379864776603, 0.025615122182936552, 0.025515150025506986, 0.030862633113371844, 0.047106741281720745, 0.03065417721381474, 0.02509825217879748, 0.024989810292950197, 0.02487969578499212, 0.024767916025125687, 0.024654478495012264, 0.024539390787271343, 0.02442266060497239, 0.02430429576111926, 0.024184304178127235, 0.024062693887292756, 0.02393947302825592, 0.0238146498484556, 0.0236882327025775, 0.023560230051994906, 0.03432897652326432, 0.028748665641773245, 0.023166795274124314, 0.023032537332237958, 0.022896737772757955, 0.022759405685042863, 0.028069713290557626, 0.0224801807946035, 0.022338306681005737, 0.022194937416174954, 0.022050082596126477, 0.021903751916307057, 0.021755955170945925, 0.021606702252399246, 0.021456003150488033, 0.021303867951829467, 0.021150306839161803, 0.020995330090662782, 0.026288111108792738, 0.020681171271945346, 0.02052201022905688, 0.020361475603589575, 0.02019957814047349, 0.02003632867585639, 0.019871738136378398, 0.030604143597502634, 0.019538577987468143, 0.019370030677166018, 0.019200186888770704, 0.019029057990294734, 0.018856655435765795, 0.018682990764460155, 0.018508075600130274, 0.01833192165022684, 0.018154540705115112, 0.017975944637285825, 0.017796145400560494, 0.01761515502929131, 0.01743298563755574, 0.022698812447876558, 0.01706515864275094, 0.027777851718200856, 0.016692762892326997, 0.016504882842751558, 0.01631589808563113, 0.021574984299655656, 0.015934665118485025, 0.032089931513800206, 0.015549166056172532, 0.015354848947786609, 0.015159504106114339, 0.020412307635539896, 0.014765783590236845, 0.014567434268598242, 0.014368109917042664, 0.019616986906311504, 0.02486491561245214, 0.019213583445451588, 0.013561329995989899, 0.018806494916410572, 0.013152439742624845, 0.012946667277100476, 0.012740028263103163, 0.012532536531429508, 0.012324205969950396, 0.01211505052268136, 0.011905084188849372, 0.02804181011054867, 0.011482775128835625, 0.011270460668713645, 0.016506554881787292, 0.010843582940620895, 0.010629048244500752, 0.010413802123167601, 0.010197858983510418, 0.009981233279071085, 0.009763939509077028, 0.009545992217470784, 0.01477656902146742, 0.009108195462923404, 0.00888837530266697, 0.008667960224206453, 0.013896128009931239, 0.008225404362938605, 0.008003293201353302, 0.007780646362025311, 0.007557478747189683, 0.007333805293938068, 0.00710964097321898, 0.006885000788835787, 0.006659899776442408, 0.00643435300253698, 0.006208375563453457, 0.005981982584351111, 0.005755189218202207, 0.005528010644777818, 0.016198788128693672, 0.01597088478214471, 0.004844315859195385, 0.004615748754758648, 0.01528519876732568, 0.004157703038880021, 0.003928255085429667, 0.0036985442053609837, 0.003468585773720567, 0.003238395182124142, 0.00845715086725737, 0.0027773791621897997, 0.0025465845906523002, 0.00776478260022525, 0.0075336625908355975, 0.0018532400318459685, 0.0016218564610193619, 0.0013903643358281665, 0.017506268239134492, 0.006376279435188409, 0.0006953916068648892, 0.00046362026400643513, 0.00023181789003986903]	\N	\N	1	\N
2025-11-17 15:28:19.694234+08	2025-11-17 15:28:19.694234+08	019a90b6-f0ed-710c-a7da-be4a9f0c6aee	019a90b6-f092-72cf-882f-c8aa914f7b81	I apologize for the mistake. According to the database, the custodian of the asset ASSET-0007-INV-2 is actually:\n\nEmployeeId: EMP0008\nFirstName: Kevin\nMiddleName: \nLastName: Martinez\nEmail: kevin.martinez8@example.com\nContactNumber: 09171234508\nPosition: Sales Executive\nDepartment: Customer Service\nIsVerified: true	[0.17473199269406645, 0.38556276186693916, 0.5231622871587366, 0.17762229288053705, 0.0009045997690777125, 0.0011306361807378947, 0.07047526491254104, 0.06107701651973788, 0.5547575748386296, 0.16791867704965788, 0.0022593807165309145, 0.011124569848238796, 0.002709925672145264, 0.011574767113876616, 0.0031597451151288026, 0.0033843451273077828, 0.012248552117448437, 0.008152767318975171, 0.008376642729268838, 0.00428032986435467, 0.004503647257449331, 0.004726663211681764, 0.004949362800111279, 0.005171731116972234, 0.0053937532786717075, 0.005615414424785699, 0.005836699719053754, 0.006057594350372005, 0.006278083533784496, 0.006498152511472776, 0.006717786553743679, 0.006936970960015204, 0.007155691059800459, 0.007373932213689598, 0.007591679814329652, 0.012128836037156655, 0.008025636092599073, 0.008241815724595137, 0.008457443714019594, 0.017312339127933056, 0.00888698707324947, 0.009100873692787809, 0.017953984670653525, 0.009526805233196727, 0.0183786551450559, 0.014270102967232625, 0.010160884801901698, 0.010370903296305061, 0.01058022764369575, 0.010788843833541957, 0.010996737902710406, 0.011203895936400914, 0.011410304069077747, 0.011615948485397673, 0.011820815421134645, 0.012024891164101074, 0.012228162055065625, 0.012430614488667438, 0.02127206841383561, 0.012833009837152036, 0.013032925818842878, 0.0132319694785898, 0.013430127493969692, 0.013627386601837528, 0.013823733599214115, 0.014019155344169792, 0.014213638756704037, 0.01440717081962096, 0.01459973857940055, 0.014791329147065695, 0.01498192969904488, 0.023811360977539286, 0.015360109793832582, 0.015547664024228525, 0.020054094365561975, 0.015919638084811165, 0.016104033017968585, 0.016287350073327694, 0.025109410480589886, 0.025290535043896015, 0.021150628389941313, 0.01700959522001471, 0.017187340310805304, 0.017363935015694908, 0.017539367514817553, 0.01771362606609623, 0.0178866990060288, 0.01805857475046866, 0.018229241795400083, 0.03135843896697146, 0.0228868209256981, 0.018733876911081637, 0.01889959574727538, 0.019064049592604392, 0.019227227439816738, 0.019389118367065784, 0.019549711538641244, 0.024028912955448845, 0.019866961706957696, 0.02002359746945801, 0.020178893009224652, 0.020332837931990883, 0.02048542193388972, 0.020636634802143526, 0.020786466415747624, 0.020934906746147713, 0.021081945857911063, 0.029867407408900384, 0.021371781153388406, 0.021514557937798526, 0.030295728205771418, 0.021795781998804675, 0.021934210452465398, 0.022071170801928632, 0.02220665388014164, 0.022340650618928662, 0.022473152049597822, 0.026924066053295902, 0.031373467112338634, 0.022861596310797615, 0.022988028832624463, 0.02311292271590791, 0.02323626960122993, 0.023358061232716422, 0.02347828945858979, 0.027916862981468962, 0.02371402361013597, 0.023829513757611605, 0.023943408944135835, 0.024055701546457215, 0.024166384048588743, 0.0242754490423109, 0.028702805977421912, 0.033128530912963146, 0.028912783267454792, 0.03333522306765082, 0.024796259702689404, 0.024895470169886108, 0.024993014329360724, 0.02508888565227146, 0.03382291122125191, 0.025275584233296455, 0.025366398995270448, 0.03409534942874524, 0.025542929070405014, 0.025628632568025434, 0.025712620685777017, 0.025794887802153194, 0.025875428410837738, 0.02595423712107333, 0.047630892406794405, 0.026106637863119946, 0.03482005319392815, 0.02625204922692922, 0.026322121652943474, 0.02639043228236289, 0.026456976543009148, 0.026521749980930792, 0.026584748260701375, 0.026645967165709633, 0.043985069597459354, 0.026763050580755378, 0.026818907254146387, 0.03119288562976105, 0.031245148589628867, 0.02697569263567678, 0.027024347889963288, 0.04003094459539569, 0.02711622886864955, 0.02715944844325647, 0.027200850177173504, 0.027240431299292957, 0.027278189160364626, 0.027314121233173123, 0.027348225112707004, 0.027380498516319775, 0.02741093928388265, 0.027439545377929156, 0.02746631488379147, 0.02749124600972861, 0.027514337087046332, 0.031855503319963244, 0.027554993036942206, 0.027572555188329604, 0.02758827184889821, 0.027602141966697902, 0.02761416461337167, 0.027624338984217733, 0.02763266439824343, 0.03195905704796517, 0.027643766250673732, 0.02764654194600732, 0.027647467198428234, 0.02764654194600732, 0.027643766250673732, 0.02763914029821076, 0.031952581147997844, 0.031944255733972145, 0.02761416461337167, 0.03192205871645231, 0.02758827184889821, 0.027572555188329604, 0.03619482653645103, 0.027535586570208836, 0.027514337087046332, 0.02749124600972861, 0.02746631488379147, 0.027439545377929156, 0.027410939283882656, 0.02738049851631977, 0.027348225112707004, 0.027314121233173123, 0.03159810591011904, 0.027240431299292957, 0.03584068367668233, 0.02715944844325647, 0.02711622886864955, 0.027071194346132456, 0.027024347889963288, 0.02697569263567678, 0.031245148589628867, 0.02687296888000664, 0.026818907254146387, 0.02676305058075538, 0.026705402598441706, 0.026645967165709633, 0.026584748260701382, 0.026521749980930792, 0.026456976543009148, 0.03503026578187171, 0.02632212165294347, 0.02625204922692922, 0.026180219694419336, 0.026106637863119946, 0.026031308658022344, 0.02595423712107333, 0.02587542841083774, 0.025794887802153194, 0.02571262068577702, 0.025628632568025434, 0.025542929070405014, 0.02545551592923642, 0.029686315745024856, 0.025275584233296455, 0.025183077721743087, 0.02508888565227146, 0.02499301432936073, 0.024895470169886108, 0.029116176452443816, 0.02469538956814199, 0.0332327000172092, 0.024488697413454316, 0.024382889227667504, 0.024275449042310902, 0.028486300798343155, 0.024055701546457222, 0.03258324244364466, 0.023829513757611605, 0.02371402361013597, 0.023596946231714554, 0.02347828945858979, 0.02335806123271643, 0.023236269601229938, 0.023112922715907914, 0.022988028832624467, 0.022861596310797618, 0.02273363361282981, 0.022604149303541488, 0.03111298554910665, 0.02666056736868307, 0.026526570629896058, 0.026391087551683047, 0.021934210452465398, 0.021795781998804678, 0.021655894706262595, 0.021514557937798526, 0.021371781153388412, 0.02122757390939157, 0.021081945857911066, 0.020934906746147713, 0.02510638316550204, 0.02063663480214353, 0.020485421933889716, 0.024652754681745298, 0.020178893009224645, 0.02002359746945801, 0.0198669617069577, 0.01970899620569443, 0.019549711538641247, 0.019389118367065788, 0.019227227439816738, 0.0190640495926044, 0.01889959574727539, 0.01873387691108164, 0.018566904175943692, 0.018398688717708223, 0.018229241795400086, 0.018058574750468657, 0.017886699006028805, 0.01771362606609623, 0.021859284264571965, 0.01736393501569491, 0.0171873403108053, 0.017009595220014714, 0.02115062838994132, 0.016650701544387195, 0.025109410480589893, 0.020607266823082115, 0.016104033017968585, 0.01591963808481117, 0.01573417761580757, 0.015547664024228532, 0.028319860043095817, 0.015171527478030463, 0.014981929699044872, 0.019111245896820107, 0.01891965532915496, 0.014407170819620958, 0.01421363875670404, 0.01833907209392421, 0.018143650348968525, 0.022267220101346356, 0.017750044243724106, 0.013231969478589801, 0.017352842568597295, 0.012833009837152045, 0.012632234914326794, 0.012430614488667448, 0.012228162055065625, 0.01202489116410108, 0.011820815421134643, 0.011615948485397674, 0.0330098878178498, 0.011203895936400915, 0.010996737902710413, 0.015108760583296367, 0.010580227643695752, 0.01037090329630507, 0.010160884801901698, 0.009950186217478221, 0.009738821645547086, 0.009526805233196729, 0.00931415117114471, 0.013420790442542224, 0.008886987073249477, 0.012992422378178641, 0.008457443714019599, 0.012561732474349545, 0.008025636092599075, 0.007808919287402248, 0.007591679814329649, 0.0073739322136896004, 0.007155691059800467, 0.006936970960015204, 0.006717786553743685, 0.006498152511472786, 0.006278083533784497, 0.006057594350372012, 0.005836699719053766, 0.005615414424785702, 0.01403358677818054, 0.013811564616481059, 0.004949362800111275, 0.004726663211681764, 0.004503647257449336, 0.01292016336386349, 0.004056725979514428, 0.0038328505692207656, 0.0036087186179396148, 0.0033843451273077862, 0.0031597451151288117, 0.002934933614367795, 0.00270992567214527, 0.0024847363487299832, 0.002259380716530918, 0.0063537906088429125, 0.0018082308700649447, 0.0059023836019885005, 0.0013565969164704473, 0.005450552930492309, 0.005224516518832121, 0.0006785028105963499, 0.00045236043845278505, 0.00022618778884561248]	\N	\N	1	\N
2025-11-18 15:37:26.867519+08	2025-11-18 15:37:26.867519+08	019a95e5-a652-734d-ac3f-6f88ac8a2052	019a95e5-a60a-7494-821d-1353df5d2e25	I apologize for the earlier mistake. According to the database, there is no information available for the asset ASSET-0007-INV-2. The initial message stated that "No inventory item found with number 'ASSET-0007-INV-2'. Please verify the inventory number is correct."	[0.15507808600826847, 0.3543571952689569, 0.45392164067204116, 0.158125464509826, 0.01175006407728526, 0.0011920825409042163, 0.04461553263616826, 0.047694810040551365, 0.6064994301819083, 0.23534453755398826, 0.0023821706321783993, 0.002619773602272283, 0.002857201225246639, 0.003094437609556583, 0.00333146687645725, 0.008966424303097657, 0.0038048406134272446, 0.00404115339956741, 0.004277195702560644, 0.004512951723584532, 0.004748405682978128, 0.0049835418212981234, 0.010616495542404732, 0.005452797704359745, 0.005686886040789084, 0.005920593741622481, 0.006153905164297494, 0.00638680469277544, 0.006619276738586603, 0.006851305741873605, 0.012481027314463941, 0.007313972530754097, 0.007544579349057636, 0.007774681192329838, 0.008004262659356115, 0.008233308383751787, 0.008461803034990594, 0.014087882461461858, 0.008917077981338796, 0.00914382780391027, 0.009369965610288631, 0.009595476264580866, 0.03141294924099487, 0.010044555784228412, 0.010268094591719124, 0.010490946133406353, 0.010713095493353905, 0.010934527802624112, 0.016553379382304143, 0.011375182034342646, 0.011594374462849135, 0.022609093138830843, 0.012030416591019348, 0.01224723710543932, 0.012463237885762132, 0.012678404474587873, 0.01289272247035088, 0.02390247981234578, 0.013318755361376985, 0.013530441741336247, 0.019139373641564743, 0.013951083527956746, 0.014160010780152435, 0.014367990272167385, 0.014575008083483876, 0.014781050357951566, 0.0149861033047149, 0.015190153199136174, 0.015393186383714142, 0.03718779383712241, 0.015796148334497724, 0.03219050355568068, 0.016194881274407446, 0.016392628460758597, 0.02738558073705572, 0.016784818088902656, 0.016979234280594578, 0.017172514015372696, 0.01736464435660588, 0.039148217012718645, 0.0177454054974306, 0.01793401081185456, 0.018121415764104202, 0.018307607810760303, 0.023890725631617104, 0.0186763034203611, 0.018858782305710347, 0.019039998931926885, 0.01921994116978954, 0.024796748117405794, 0.030372256674924686, 0.019752001545337187, 0.030723028939643533, 0.02010011802686525, 0.020272164053728836, 0.020442853220759057, 0.02061217410336039, 0.020780115368519553, 0.02094666577556404, 0.021111814176914497, 0.02127554951883084, 0.021437860842152108, 0.02159873728303001, 0.021758168073656017, 0.02191614254298211, 0.022072650117435033, 0.02222768032162393, 0.03857567620513478, 0.022533267212758855, 0.0226838034461126, 0.02283282140338678, 0.02298031111048685, 0.023126262695607375, 0.023270666389892752, 0.023413512528091058, 0.02355479154920098, 0.02369449399711172, 0.02383261052123598, 0.02936728301916679, 0.024104048927141027, 0.024237352640961607, 0.024369034096291257, 0.029897235621436133, 0.03542379736981144, 0.02475425732052406, 0.030277513841289554, 0.025002802848378716, 0.02512456950576828, 0.025244654521321165, 0.025363049857487267, 0.02547974758981039, 0.02559473990745863, 0.03650432139780932, 0.03661587991071566, 0.02592940797932481, 0.02603750282057775, 0.02614385491539056, 0.026248457145387264, 0.026351302509314126, 0.02645238412350826, 0.026551695222358365, 0.026649229158757563, 0.026744979404548314, 0.026838939550959347, 0.026931103309034622, 0.027021464510054258, 0.027110017105947418, 0.027196755169697134, 0.02728167289573698, 0.027364764600339708, 0.06523308271621506, 0.027525447821794773, 0.03839933086783332, 0.027678761815278497, 0.033150793589358574, 0.02782466553492755, 0.027894826257417443, 0.027963119918788106, 0.02802954194799692, 0.02809408789927365, 0.02815675345241803, 0.028217534413088892, 0.02827642671308495, 0.02833342641061704, 0.028388529690571998, 0.028441732864767984, 0.028493032372201355, 0.028542424779284998, 0.02858990678007817, 0.02863547519650775, 0.03407727812061203, 0.028720859204589513, 0.028760669081305156, 0.02879855394416666, 0.028834511257458107, 0.028868538614478675, 0.028900633737703678, 0.028930794478937028, 0.028959018819455014, 0.02898530487014141, 0.029009650871613925, 0.029032055194341974, 0.029052516338755725, 0.029071032935346477, 0.029087603744758328, 0.02910222765787113, 0.034513054837905774, 0.029125631010334403, 0.02913440888324782, 0.02914123672709292, 0.02914611408486734, 0.029149040630118955, 0.029150016166967756, 0.029149040630118955, 0.02914611408486734, 0.02914123672709292, 0.03453256002527889, 0.029125631010334403, 0.029114903695874713, 0.02910222765787113, 0.029087603744758328, 0.029071032935346477, 0.029052516338755725, 0.029032055194341974, 0.029009650871613925, 0.02898530487014141, 0.028959018819455014, 0.028930794478937028, 0.02890063373770368, 0.03426668975650974, 0.034232662399489175, 0.02879855394416666, 0.028760669081305156, 0.028720859204589513, 0.028679126978580965, 0.02863547519650775, 0.0393862090641403, 0.028542424779284998, 0.028493032372201355, 0.028441732864767984, 0.028388529690571998, 0.028333426410617042, 0.02827642671308495, 0.028217534413088895, 0.02815675345241803, 0.02809408789927365, 0.028029541947996922, 0.027963119918788106, 0.027894826257417443, 0.027824665534927552, 0.027752642447327502, 0.027678761815278497, 0.027603028583771203, 0.027525447821794773, 0.0274460247219976, 0.027364764600339708, 0.027281672895736988, 0.027196755169697134, 0.037906319390009546, 0.027021464510054258, 0.026931103309034622, 0.02683893955095935, 0.03754128168861044, 0.05903813601094395, 0.026551695222358365, 0.02645238412350826, 0.02635130250931413, 0.026248457145387264, 0.02614385491539056, 0.026037502820577745, 0.04212386140541801, 0.02581957762665352, 0.025708019113747194, 0.025594739907458634, 0.02547974758981039, 0.02536304985748727, 0.02524465452132117, 0.02512456950576828, 0.025002802848378716, 0.024879362699258493, 0.02475425732052406, 0.035423797369811445, 0.024499084479405075, 0.024369034096291264, 0.02423735264096161, 0.024104048927141034, 0.023969131877135726, 0.02383261052123598, 0.023694493997111727, 0.023554791549200975, 0.023413512528091065, 0.023270666389892756, 0.023126262695607375, 0.03377661339454898, 0.02283282140338678, 0.0226838034461126, 0.022533267212758862, 0.022381222779041587, 0.022227680321623935, 0.027470801259466097, 0.02731429368501318, 0.021758168073656024, 0.021598737283030005, 0.02143786084215211, 0.02127554951883083, 0.031908116460976625, 0.020946665775564047, 0.02078011536851955, 0.020612174103360394, 0.02044285322075906, 0.020272164053728836, 0.025498269168896324, 0.019926726655581414, 0.019752001545337194, 0.019575954390862557, 0.01939859697537473, 0.019219941169789544, 0.019039998931926882, 0.01885878230571035, 0.024074454562392163, 0.018492574489586036, 0.01830760781076031, 0.0181214157641042, 0.017934010811854563, 0.01774540549743061, 0.017555612444594384, 0.017364644356605882, 0.017172514015372706, 0.016979234280594578, 0.01678481808890266, 0.021987429595024664, 0.016392628460758604, 0.016194881274407446, 0.01599605012958748, 0.015796148334497717, 0.015595189268998152, 0.015393186383714143, 0.01519015319913617, 0.014986103304714903, 0.014781050357951575, 0.014575008083483876, 0.019766141414198458, 0.014160010780152443, 0.013951083527956747, 0.019139373641564747, 0.013530441741336257, 0.013318755361376992, 0.01310617752828366, 0.01289272247035088, 0.01267840447458788, 0.01246323788576213, 0.012247237105439322, 0.012030416591019347, 0.011812790854768713, 0.01159437446284914, 0.011375182034342643, 0.011155228240273082, 0.010934527802624121, 0.010713095493353905, 0.010490946133406362, 0.0156662457337502, 0.010044555784228413, 0.00982034467287062, 0.009595476264580868, 0.009369965610288637, 0.009143827803910267, 0.008917077981338799, 0.014087882461461853, 0.008461803034990596, 0.01902961066781392, 0.008004262659356111, 0.007774681192329841, 0.007544579349057644, 0.007313972530754097, 0.0070828761724328814, 0.006851305741873617, 0.006619276738586604, 0.006386804692775447, 0.0061539051642975065, 0.005920593741622486, 0.016483188324851225, 0.005452797704359746, 0.005218344400373662, 0.0049835418212981234, 0.004748405682978132, 0.015309254007646659, 0.004277195702560646, 0.004041153399567416, 0.0038048406134272446, 0.0035682731610665952, 0.008729618018488325, 0.0030944376095565843, 0.0028572012252466453, 0.0026197736022722947, 0.0023821706321784032, 0.018338861644339437, 0.0019065022744289533, 0.00706661986631756, 0.0014303234999197424, 0.0011920825409042202, 0.006351912935254193, 0.0007153772082001445, 0.0004769447414316835, 0.00023848035171898595]	\N	\N	1	\N
2025-11-18 15:38:04.903786+08	2025-11-18 15:38:04.903786+08	019a95e6-3ae6-723d-bf02-624a1c3bafc0	019a95e6-3aa3-7124-bd8a-bff76c16691c	According to the database, the current status of the asset ASSET-0007-INV-2, which is the Panasonic CS/CU-XU18UKY Air Conditioner, is:\n\nStatus: Transferred	[0.09222684851340654, 0.370000804872203, 0.5211222064286282, 0.08403178580737221, 0.0009734122241617904, 0.0012166431133759418, 0.08646149626902444, 0.08999493654888685, 0.596957707987078, 0.0021885896332456095, 0.002431250685315705, 0.002673749008513294, 0.0029160683719005476, 0.0031581925565178047, 0.003400105356469143, 0.003641790580007072, 0.003883232050616284, 0.004124413608096384, 0.004365319109643521, 0.004605932430930872, 0.004846237467187865, 0.005086218134278116, 0.005325858369775972, 0.005565142134041604, 0.005804053411294568, 0.0060425762106857935, 0.006280694567367863, 0.006518392543563593, 0.0067556542296327736, 0.0069924637451370345, 0.00722880523990277, 0.0074646628950820046, 0.007700020924211198, 0.007934863574267868, 0.008169175126724963, 0.008402939898602945, 0.008636142243519485, 0.008868766552736712, 0.009100797256205932, 0.030582644748357816, 0.009563015765401639, 0.00979317263384251, 0.0312730999487829, 0.010251504574953677, 0.010479648970474773, 0.010707091940399762, 0.05343467011097431, 0.011159812758426535, 0.011385060304943741, 0.011609545824723825, 0.0118332542924649, 0.012056170734874843, 0.012278280231673506, 0.01249956791659136, 0.01272001897836452, 0.012939618661726097, 0.013158352268393816, 0.01337620515805377, 0.01359316274934037, 0.01380921052081227, 0.014024334011924341, 0.014238518823995534, 0.01445175062117263, 0.014664015131389752, 0.014875298147323635, 0.015085585527344555, 0.015294863196462853, 0.015503117147271012, 0.01571033344088119, 0.015916498207858183, 0.016121597649147765, 0.03757604396174828, 0.02715375867826332, 0.016730367103426024, 0.027556281653641997, 0.017130637046023297, 0.017329058810149914, 0.017526320702849523, 0.017722409520956543, 0.03916773806456985, 0.01811101551419102, 0.018303506679077944, 0.018494772750632122, 0.018684800927001265, 0.018873578489188067, 0.019061092801901554, 0.01924733131440278, 0.019432281561344855, 0.019615931163607294, 0.019798267829124583, 0.019979279353708898, 0.020158953621866982, 0.02033727860761103, 0.02051424237526364, 0.020689833080256688, 0.02086403896992409, 0.02103684838428846, 0.021208249756841536, 0.021378231615318325, 0.021546782582465004, 0.0217138913768004, 0.021879546813371065, 0.022043737804499974, 0.02220645336052857, 0.022367682590552378, 0.022527414703149957, 0.022685639007105133, 0.04409277083687073, 0.022997521929537048, 0.023151159673014496, 0.023303247859248196, 0.023453776308646524, 0.023602734946014454, 0.02375011380122786, 0.023895903009900854, 0.04529051873879409, 0.024182673562727627, 0.02432363571270739, 0.03508818279145744, 0.02460066658592161, 0.024736716766879906, 0.024871111265825106, 0.02500384108744241, 0.02513489734783747, 0.025264271275131017, 0.025391954210045975, 0.025517937606487053, 0.02564221303211274, 0.025764772168899726, 0.025885606813699624, 0.02600470887878802, 0.02612207039240582, 0.03686289646166683, 0.04760196638596146, 0.02646363365747465, 0.03719916854781022, 0.026682498861012538, 0.026789256219167223, 0.026894220514399117, 0.026997384721220683, 0.027098741934628176, 0.027198285370563846, 0.02729600836637, 0.027391904381234934, 0.038111179959004766, 0.02757818991674291, 0.027668566968891712, 0.02775709210394537, 0.027843759396724913, 0.027928563046400793, 0.07051234922637721, 0.028092556837191557, 0.02817173600184695, 0.028249029571214362, 0.028324432371867835, 0.028397939356934656, 0.028469545606433173, 0.028539246327602043, 0.028607036855221098, 0.028672912651923538, 0.02873686930849966, 0.028798902544191953, 0.02885900820698165, 0.02891718227386659, 0.02897342085113052, 0.0290277201746037, 0.029080076609914837, 0.02913048665273435, 0.029178946929008933, 0.029225454195187368, 0.029270005338437627, 0.029312597376855234, 0.029353227459662838, 0.029391892867401025, 0.029428591012110334, 0.029463319437504482, 0.02949607581913476, 0.02952685796454563, 0.029555663813421444, 0.029582491437724366, 0.02960733904182342, 0.029630204962614655, 0.04027630063200651, 0.029669985765152125, 0.029686897984283114, 0.029701823195054006, 0.029714760398488135, 0.029725708728670457, 0.029734667452805532, 0.02974163597126655, 0.02974661381763549, 0.029749600658734308, 0.029750596294647273, 0.029749600658734308, 0.02974661381763549, 0.02974163597126655, 0.04035988041517955, 0.029725708728670457, 0.029714760398488135, 0.029701823195054006, 0.029686897984283114, 0.029669985765152125, 0.02965108766963249, 0.05088063088736271, 0.02960733904182342, 0.029582491437724366, 0.029555663813421444, 0.02952685796454563, 0.029496075819134764, 0.02946331943750448, 0.029428591012110334, 0.029391892867401025, 0.029353227459662838, 0.029312597376855234, 0.02927000533843763, 0.029225454195187368, 0.029178946929008933, 0.02913048665273435, 0.029080076609914837, 0.0290277201746037, 0.02897342085113052, 0.028917182273866592, 0.02885900820698165, 0.03942411550656598, 0.02873686930849966, 0.028672912651923538, 0.0286070368552211, 0.028539246327602043, 0.028469545606433173, 0.02839793935693466, 0.038949645334241854, 0.028249029571214362, 0.028171736001846952, 0.028092556837191557, 0.02801149737688111, 0.027928563046400793, 0.027843759396724916, 0.02775709210394537, 0.027668566968891715, 0.02757818991674291, 0.027485966996630744, 0.048642330305982986, 0.037921221328744016, 0.027198285370563846, 0.027098741934628176, 0.026997384721220683, 0.026894220514399124, 0.026789256219167223, 0.026682498861012538, 0.026573955585436196, 0.026463633657474655, 0.026351540461213407, 0.02623768349929281, 0.026122070392405824, 0.02600470887878802, 0.025885606813699627, 0.02576477216889973, 0.02564221303211274, 0.025517937606487053, 0.02539195421004598, 0.025264271275131017, 0.025134897347837477, 0.025003841087442417, 0.024871111265825113, 0.02473671676687991, 0.024600666585921614, 0.024462969829083414, 0.02432363571270739, 0.02418267356272763, 0.024040092814046038, 0.023895903009900857, 0.023750113801227865, 0.023602734946014454, 0.023453776308646528, 0.055178886746370275, 0.023151159673014496, 0.022997521929537055, 0.02284234491212268, 0.022685639007105136, 0.022527414703149957, 0.02236768259055238, 0.022206453360528577, 0.022043737804499967, 0.021879546813371068, 0.02171389137680039, 0.021546782582465004, 0.02137823161531833, 0.02120824975684153, 0.021036848384288463, 0.03148925193229812, 0.020689833080256688, 0.02051424237526365, 0.020337278607611045, 0.020158953621866985, 0.019979279353708905, 0.019798267829124583, 0.019615931163607297, 0.01943228156134485, 0.019247331314402785, 0.019061092801901554, 0.018873578489188067, 0.01868480092700127, 0.029119985713006145, 0.018303506679077947, 0.01811101551419103, 0.0179173121398218, 0.017722409520956547, 0.017526320702849534, 0.017329058810149914, 0.0171306370460233, 0.01693106869126798, 0.01673036710342603, 0.016528545715889298, 0.016325618037000236, 0.016121597649147754, 0.015916498207858183, 0.01571033344088119, 0.03675354307201906, 0.015294863196462859, 0.015085585527344564, 0.014875298147323635, 0.014664015131389756, 0.014451750621172637, 0.014238518823995535, 0.014024334011924348, 0.013809210520812281, 0.013593162749340375, 0.01337620515805378, 0.013158352268393816, 0.012939618661726103, 0.012720018978364517, 0.012499567916591361, 0.012278280231673504, 0.012056170734874845, 0.011833254292464906, 0.02223475878709785, 0.011385060304943743, 0.011159812758426544, 0.01093381826147821, 0.03195751786514782, 0.010479648970474783, 0.010251504574953678, 0.010022674024034853, 0.009793172633842512, 0.009563015765401646, 0.009332218823609765, 0.009100797256205937, 0.019493979515110733, 0.008636142243519487, 0.008402939898602949, 0.00816917512672496, 0.007934863574267871, 0.007700020924211207, 0.0074646628950820046, 0.007228805239902776, 0.006992463745137047, 0.006755654229632775, 0.0065183925435636, 0.027531120492115924, 0.006042576210685797, 0.005804053411294578, 0.005565142134041605, 0.005325858369775968, 0.005086218134278116, 0.00484623746718787, 0.025856358355678916, 0.004365319109643523, 0.0041244136080963905, 0.003883232050616284, 0.0036417905800070764, 0.003400105356469153, 0.003158192556517806, 0.002916068371900554, 0.002673749008513306, 0.013056463647689734, 0.012813802595619643, 0.0019457820941326325, 0.0017028443196110959, 0.0014597925700322398, 0.0012166431133759455, 0.01159862518653581, 0.0007301161823598474, 0.00048677127230097706, 0.00024339378158688243]	\N	\N	1	\N
2025-11-18 15:39:18.198352+08	2025-11-18 15:39:18.198352+08	019a95e7-5936-75bf-9901-af84ef8f2257	019a95e7-58f6-768d-ac60-17327f34c1b7	According to the database, the transaction date for the asset ASSET-0007-INV-2, Panasonic CS/CU-XU18UKY Air Conditioner, is:\n\nTransaction Date: 2025-11-17T02:21:00.000Z	[0.10049514305116414, 0.34508096707878316, 0.5019094614339642, 0.10242552400149388, 0.000978603841868238, 0.0012231319839418207, 0.17740445334871643, 0.0907276071550456, 0.6001415350747796, 0.06201879983475396, 0.03763159258796157, 0.0026880092390206183, 0.00293162099371584, 0.0031750365286704126, 0.003418239551555539, 0.003661213784266316, 0.003903942964011259, 0.004146410844400814, 0.004388601196534751, 0.0046304978100884155, 0.004872084494397707, 0.005113345079542761, 0.0053542634174302385, 0.0055948233828741496, 0.005835008874675144, 0.006074803816698209, 0.00631419215894867, 0.006553157878646458, 0.006791684981298545, 0.007029757501769491, 0.007267359505350029, 0.007504475088823605, 0.00774108838153081, 0.007977183546431654, 0.008212744781165555, 0.008447756319109035, 0.008682202430431012, 0.008916067423145636, 0.009149335644162582, 0.02697567898929205, 0.009614019359503253, 0.009845403751539781, 0.027669816678343277, 0.010306180170090043, 0.01053554135584041, 0.010764197374996301, 0.010992132923115268, 0.011219332743977546, 0.0114457816306072, 0.011671464426289933, 0.011896366025587586, 0.01212047137534916, 0.012343765475718364, 0.021363077135616238, 0.012787860201348228, 0.013008631102387345, 0.013228531307580522, 0.013447546098530893, 0.013665660816104293, 0.013882860861410416, 0.014099131696779942, 0.014314458846737592, 0.014528827898970998, 0.01474222450529534, 0.014954634382613708, 0.015166043313873109, 0.015376437149016027, 0.015585801805927536, 0.01579412327137783, 0.016001387601960168, 0.01620758092502414, 0.034006376948561484, 0.016616699417343308, 0.01681959720341199, 0.025818212971900754, 0.01722200195433585, 0.01742148198536976, 0.01761979595889343, 0.017816930601323236, 0.035606560226968016, 0.018207609194125736, 0.018401126995534325, 0.018593413169671027, 0.01878445484640586, 0.03656792674786307, 0.019162753644490427, 0.019349985445482512, 0.01953592211005219, 0.02851739494753456, 0.01990386033686937, 0.020085837272214697, 0.020266469818981586, 0.020445745887042573, 0.020623653477062253, 0.02080018068130043, 0.020975315684409104, 0.021149046764223304, 0.021321362292545713, 0.02149225073592491, 0.02166170065642738, 0.021829700712403054, 0.021996239659244417, 0.022161306350139187, 0.022324889736816324, 0.02248697887028557, 0.022647562901570287, 0.022806631082433533, 0.040557860275054876, 0.023120177407956393, 0.02327463456628155, 0.023427533902921, 0.023578865183991073, 0.02372861828056148, 0.023876783169333216, 0.02402334993330947, 0.02416830876245939, 0.02431164995437466, 0.02445336391491896, 0.033390284913348715, 0.024731872310554733, 0.024868648104476268, 0.02500375938593463, 0.025137197111639198, 0.025268952350314088, 0.02539901628329589, 0.02552738020512396, 0.02565403552412307, 0.02577897376297849, 0.025902186559303375, 0.02602366566619849, 0.026143402952804182, 0.026261390404844605, 0.03517446387964278, 0.04408577184321322, 0.026604775370782596, 0.026715685692089118, 0.02682480787470752, 0.026932134614853855, 0.027037658728917016, 0.02714137315393958, 0.027243270948090502, 0.0273433452911298, 0.027441589484865015, 0.027537996953599535, 0.03642940499905139, 0.02772527602839189, 0.027816135099455745, 0.027905132376369966, 0.027992261902354102, 0.028077517845640335, 0.06334826951777839, 0.02824238628444443, 0.028321987744960718, 0.028399693553514533, 0.028475498509087857, 0.028549397537890875, 0.0286213856937016, 0.028691458158196875, 0.028759610241274942, 0.028825837381369315, 0.028890135145754118, 0.028952499230840752, 0.029012925462465984, 0.029071409796171288, 0.029127948317473586, 0.029182537242127226, 0.029235172916377283, 0.02928585181720411, 0.029334570552559155, 0.02938132586159197, 0.02942611461486849, 0.029468933814580472, 0.029509780594746175, 0.029548652221402166, 0.029585546092786293, 0.029620459739511877, 0.029653390824732936, 0.029684337144300642, 0.029713296626910822, 0.029740267334242593, 0.029765247461088124, 0.029788235335473437, 0.029809229418770327, 0.02982822830579934, 0.02984523072492383, 0.029860235538135074, 0.029873241741128435, 0.029884248463370587, 0.029893254968157774, 0.02990026065266513, 0.02990526504798703, 0.02990826781916845, 0.02990926876522742, 0.02990826781916845, 0.02990526504798703, 0.03869710440714378, 0.03869009872263643, 0.029884248463370587, 0.04746692925008574, 0.029860235538135074, 0.02984523072492383, 0.02982822830579934, 0.029809229418770327, 0.029788235335473437, 0.029765247461088124, 0.029740267334242593, 0.029713296626910822, 0.029684337144300642, 0.02965339082473294, 0.029620459739511874, 0.029585546092786293, 0.029548652221402166, 0.029509780594746175, 0.029468933814580472, 0.029426114614868493, 0.02938132586159197, 0.04692825806151646, 0.02928585181720411, 0.029235172916377283, 0.029182537242127226, 0.029127948317473586, 0.02907140979617129, 0.029012925462465984, 0.03774934298531941, 0.028890135145754118, 0.028825837381369315, 0.028759610241274946, 0.028691458158196875, 0.0286213856937016, 0.02854939753789088, 0.0372723422635665, 0.028399693553514533, 0.02832198774496072, 0.02824238628444443, 0.028160894499863778, 0.028077517845640335, 0.027992261902354106, 0.027905132376369966, 0.027816135099455748, 0.02772527602839189, 0.02763256124457274, 0.045131684462556845, 0.03623843323934366, 0.0273433452911298, 0.027243270948090502, 0.02714137315393958, 0.027037658728917023, 0.026932134614853855, 0.02682480787470752, 0.026715685692089115, 0.0266047753707826, 0.026492084334255907, 0.02637762012516413, 0.02626139040484461, 0.026143402952804182, 0.026023665666198494, 0.02590218655930338, 0.04337266127193579, 0.02565403552412307, 0.025527380205123962, 0.02539901628329589, 0.025268952350314094, 0.02513719711163921, 0.025003759385934632, 0.024868648104476275, 0.024731872310554737, 0.02459344115887006, 0.02445336391491896, 0.03310849370885331, 0.03296515251693804, 0.024023349933309474, 0.02387678316933322, 0.02372861828056148, 0.023578865183991077, 0.04981806516635695, 0.040868322075238855, 0.0231201774079564, 0.02296417276609758, 0.022806631082433537, 0.022647562901570287, 0.05767435388820019, 0.02232488973681633, 0.02216130635013918, 0.02199623965924442, 0.021829700712403043, 0.02166170065642738, 0.021492250735924916, 0.02132136229254571, 0.021149046764223307, 0.029772159438887762, 0.02080018068130043, 0.02062365347706226, 0.020445745887042583, 0.02026646981898159, 0.0200858372722147, 0.01990386033686937, 0.019720551193055907, 0.019535922110052187, 0.019349985445482516, 0.019162753644490427, 0.018974239238905767, 0.018784454846405868, 0.01859341316967102, 0.01840112699553433, 0.018207609194125746, 0.01801287271801071, 0.01781693060132324, 0.01761979595889344, 0.01742148198536976, 0.017222001954335858, 0.01702136921742211, 0.016819597203411998, 0.016616699417343308, 0.01641268943960418, 0.016207580925024133, 0.016001387601960168, 0.015794123271377834, 0.03317948931488484, 0.03297012465797333, 0.015166043313873117, 0.014954634382613708, 0.014742224505295344, 0.014528827898971006, 0.014314458846737595, 0.014099131696779949, 0.013882860861410426, 0.0136656608161043, 0.013447546098530903, 0.013228531307580522, 0.01300863110238735, 0.012787860201348226, 0.012566233381137588, 0.012343765475718362, 0.012120471375349162, 0.011896366025587593, 0.02046830818076858, 0.011445781630607202, 0.011219332743977555, 0.010992132923115268, 0.010764197374996308, 0.01053554135584042, 0.010306180170090044, 0.01007612916938598, 0.009845403751539783, 0.00961401935950326, 0.009381991480334738, 0.009149335644162586, 0.017712911177624288, 0.008682202430431014, 0.00844775631910904, 0.008212744781165552, 0.007977183546431657, 0.007741088381530818, 0.007504475088823605, 0.007267359505350035, 0.007029757501769502, 0.006791684981298547, 0.024146845387603772, 0.006314192158948682, 0.0060748038166982135, 0.005835008874675154, 0.005594823382874152, 0.005354263417430235, 0.005113345079542761, 0.004872084494397712, 0.022224185319045717, 0.004388601196534753, 0.00414641084440082, 0.003903942964011259, 0.0036612137842663203, 0.003418239551555549, 0.003175036528670414, 0.002931620993715847, 0.0026880092390206304, 0.011241061324525615, 0.01099710605877778, 0.001956159770231252, 0.0017119263061544942, 0.010264422013622047, 0.0012231319839418244, 0.009775447596346886, 0.00073401019972065, 0.0004893674286811211, 0.0002446919032200002]	\N	\N	1	\N
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_messages (created_at, updated_at, id, session_id, role, content, metadata, version, deleted_at) FROM stdin;
2025-11-17 15:25:23.548345+08	2025-11-17 15:25:23.548345+08	019a90b4-40da-708a-9e6e-54318e81261b	019a90b4-1559-7221-85bd-5f339ca0c34b	user	who is the accountable officer or custodian on this item ASSET-0009-INV-1	{"timestamp": "2025-11-17T07:25:23.545Z"}	1	\N
2025-11-17 15:26:24.917769+08	2025-11-17 15:26:24.917769+08	019a90b5-3094-74fa-942b-47827e1d3127	019a90b4-1559-7221-85bd-5f339ca0c34b	user	current status of this item ASSET-0007-INV-7	{"timestamp": "2025-11-17T07:26:24.916Z"}	1	\N
2025-11-17 15:26:34.75295+08	2025-11-17 15:26:34.75295+08	019a90b5-5700-71cb-a52d-37931dc6c125	019a90b4-1559-7221-85bd-5f339ca0c34b	assistant	According to the database, the current status of the asset ASSET-0007-INV-7 is:\n\nStatus: Available	{"modelUsed": "meta/meta-llama-3-8b-instruct", "timestamp": "2025-11-17T07:26:34.750Z", "ragContext": "[1] assets_inventory: version: 7, asset: id: 019a75cb-233c-711f-a2e9-6d0404da7905, version: 3, createdAt: 2025-11-12T02:00:38.482Z, updatedAt: 2025-11-12T02:00:38.482Z, deletedAt: null, assetNo: ASSET-0007, assetName: Panasonic CS/CU-XU18UKY Air Conditioner 2018 #007-FG5, assetDescription: A air conditioner used in government offices and departments., assetImage: , manufacturer: Panasonic, acquisitionCost: 77849.25, currentQuantity: 10, acquisitionDate: 2018-03-16T16:00:00.000Z, warrantyDate: 2020-03-16T16:00:00.000Z, purchaseOrderNo: PO-790285, supplier: GadgetWorks Inc., supplierContactNo: 09221234567, supplierContactEmail: support@gadgetworks.com, purchaseDate: 2018-03-12T16:00:00.000Z, deliveryDate: 2018-03-16T16:00:00.000Z, acquisitionType: Lease, invoiceNo: INVOICE-NO-97351, invoiceAmount: 778492.50, isVerified: true, isApproved: false, isDraft: false, preparedBy: null, finalizedBy: null, verifiedBy: null, approvedBy: null, approvedAt: null, verifiedAt: 2025-11-17T03:15:12.068Z, depreciation: null, inventories: null, transactions: null, custodian: null, inventoryNo: ASSET-0007-INV-7, qrCode: /uploads/RVTM_AIMS_ASSET_inventory_qr/QR-ASSET-0007-INV-7.png, barCode: null, rfidTag: null, location: null, isDraft: false, status: Available", "contextUsed": true, "performance": {"tokensUsed": 20, "responseTimeMs": 1116}}	1	\N
2025-11-17 15:27:48.630534+08	2025-11-17 15:27:48.630534+08	019a90b6-7796-730c-8b0e-c5fbb35bf233	019a90b4-1559-7221-85bd-5f339ca0c34b	user	who is the accountable officer ?	{"timestamp": "2025-11-17T07:27:48.629Z"}	1	\N
2025-11-17 15:27:55.542799+08	2025-11-17 15:27:55.542799+08	019a90b6-9296-7529-bbff-28909760ce9a	019a90b4-1559-7221-85bd-5f339ca0c34b	assistant	According to the database, the custodian of the asset ASSET-0007-INV-2 is:\n\nEmployeeId: EMP0005\nFirstName: Sophia\nMiddleName: \nLastName: Patel\nEmail: sophia.patel5@example.com\nContactNumber: 09171234505\nPosition: IT Support\nDepartment: IT\nIsVerified: true	{"modelUsed": "meta/meta-llama-3-8b-instruct", "timestamp": "2025-11-17T07:27:55.541Z", "ragContext": "[1] employees: version: 1, user: null, issuedAsset: [], employeeId: EMP0006, firstName: Daniel, middleName: , lastName: Miller, email: daniel.miller6@example.com, contactNumber: 09171234506, position: Network Admin, department: Sales, isVerified: false", "contextUsed": true, "performance": {"tokensUsed": 39, "responseTimeMs": 1286}}	1	\N
2025-11-17 15:28:19.602444+08	2025-11-17 15:28:19.602444+08	019a90b6-f092-72cf-882f-c8aa914f7b81	019a90b4-1559-7221-85bd-5f339ca0c34b	assistant	I apologize for the mistake. According to the database, the custodian of the asset ASSET-0007-INV-2 is actually:\n\nEmployeeId: EMP0008\nFirstName: Kevin\nMiddleName: \nLastName: Martinez\nEmail: kevin.martinez8@example.com\nContactNumber: 09171234508\nPosition: Sales Executive\nDepartment: Customer Service\nIsVerified: true	{"modelUsed": "meta/meta-llama-3-8b-instruct", "timestamp": "2025-11-17T07:28:19.600Z", "ragContext": "[1] assets_inventory: version: 3, asset: id: 019a75cb-233c-711f-a2e9-6d0404da7905, version: 3, createdAt: 2025-11-12T02:00:38.482Z, updatedAt: 2025-11-12T02:00:38.482Z, deletedAt: null, assetNo: ASSET-0007, assetName: Panasonic CS/CU-XU18UKY Air Conditioner 2018 #007-FG5, assetDescription: A air conditioner used in government offices and departments., assetImage: , manufacturer: Panasonic, acquisitionCost: 77849.25, currentQuantity: 10, acquisitionDate: 2018-03-16T16:00:00.000Z, warrantyDate: 2020-03-16T16:00:00.000Z, purchaseOrderNo: PO-790285, supplier: GadgetWorks Inc., supplierContactNo: 09221234567, supplierContactEmail: support@gadgetworks.com, purchaseDate: 2018-03-12T16:00:00.000Z, deliveryDate: 2018-03-16T16:00:00.000Z, acquisitionType: Lease, invoiceNo: INVOICE-NO-97351, invoiceAmount: 778492.50, isVerified: true, isApproved: false, isDraft: false, preparedBy: null, finalizedBy: null, verifiedBy: null, approvedBy: null, approvedAt: null, verifiedAt: 2025-11-17T03:15:12.068Z, depreciation: null, inventories: null, transactions: null, custodian: id: 019a75a4-1f21-733e-8344-cff48770b8fe, version: 2, createdAt: 2025-11-12T01:18:01.505Z, updatedAt: 2025-11-12T01:18:01.505Z, deletedAt: null, user: null, issuedAsset: null, employeeId: EMP0008, firstName: Kevin, middleName: , lastName: Martinez, email: kevin.martinez8@example.com, contactNumber: 09171234508, position: Sales Executive, department: Customer Service, isVerified: true, inventoryNo: ASSET-0007-INV-2, qrCode: /uploads/RVTM_AIMS_ASSET_inventory_qr/QR-ASSET-0007-INV-2.png, barCode: null, rfidTag: null, location: null, isDraft: false, status: For-Transfer", "contextUsed": true, "performance": {"tokensUsed": 49, "responseTimeMs": 1504}}	1	\N
2025-11-18 15:37:55.169088+08	2025-11-18 15:37:55.169088+08	019a95e6-14e0-769c-b599-bd214531d7b8	019a90b4-1559-7221-85bd-5f339ca0c34b	user	ASSET-0007-INV-2\n the Panasonic CS/CU-XU18UKY Air Conditioner	{"timestamp": "2025-11-18T07:37:55.166Z"}	1	\N
2025-11-18 15:38:04.836027+08	2025-11-18 15:38:04.836027+08	019a95e6-3aa3-7124-bd8a-bff76c16691c	019a90b4-1559-7221-85bd-5f339ca0c34b	assistant	According to the database, the current status of the asset ASSET-0007-INV-2, which is the Panasonic CS/CU-XU18UKY Air Conditioner, is:\n\nStatus: Transferred	{"modelUsed": "meta/meta-llama-3-8b-instruct", "timestamp": "2025-11-18T07:38:04.832Z", "ragContext": "[1] assets_inventory: version: 4, asset: id: 019a75cb-233c-711f-a2e9-6d0404da7905, version: 3, createdAt: 2025-11-12T02:00:38.482Z, updatedAt: 2025-11-12T02:00:38.482Z, deletedAt: null, assetNo: ASSET-0007, assetName: Panasonic CS/CU-XU18UKY Air Conditioner 2018 #007-FG5, assetDescription: A air conditioner used in government offices and departments., assetImage: , manufacturer: Panasonic, acquisitionCost: 77849.25, currentQuantity: 10, acquisitionDate: 2018-03-16T16:00:00.000Z, warrantyDate: 2020-03-16T16:00:00.000Z, purchaseOrderNo: PO-790285, supplier: GadgetWorks Inc., supplierContactNo: 09221234567, supplierContactEmail: support@gadgetworks.com, purchaseDate: 2018-03-12T16:00:00.000Z, deliveryDate: 2018-03-16T16:00:00.000Z, acquisitionType: Lease, invoiceNo: INVOICE-NO-97351, invoiceAmount: 778492.50, isVerified: true, isApproved: false, isDraft: false, preparedBy: null, finalizedBy: null, verifiedBy: null, approvedBy: null, approvedAt: null, verifiedAt: 2025-11-17T03:15:12.068Z, depreciation: null, inventories: null, transactions: null, custodian: null, inventoryNo: ASSET-0007-INV-2, qrCode: /uploads/RVTM_AIMS_ASSET_inventory_qr/QR-ASSET-0007-INV-2.png, barCode: null, rfidTag: null, location: null, isDraft: false, status: Transferred", "contextUsed": true, "performance": {"tokensUsed": 29, "responseTimeMs": 1030}}	1	\N
2025-11-18 15:39:45.388918+08	2025-11-18 15:39:45.388918+08	019a95e7-c36c-731e-9fbf-1edf795d2d3b	019a90b4-1559-7221-85bd-5f339ca0c34b	user	can you make the date readable ?	{"timestamp": "2025-11-18T07:39:45.386Z"}	1	\N
2025-11-17 15:25:40.460574+08	2025-11-17 15:25:40.460574+08	019a90b4-82ea-76db-8499-d46c052e8c01	019a90b4-1559-7221-85bd-5f339ca0c34b	assistant	According to the database, the custodian of the asset ASSET-0009-INV-1 is:\n\nEmployeeId: EMP0002\nFirstName: Robert\nMiddleName: \nLastName: Brown\nEmail: robert.brown2@example.com\nContactNumber: 09171234502\nPosition: Project Manager\nDepartment: Human Resources\nIsVerified: true	{"modelUsed": "meta/meta-llama-3-8b-instruct", "timestamp": "2025-11-17T07:25:40.456Z", "ragContext": "[1] assets_inventory: version: 3, asset: id: 019a75cb-233c-711f-a2e9-746e23f21bd4, version: 5, createdAt: 2025-11-12T02:00:38.482Z, updatedAt: 2025-11-12T02:00:38.482Z, deletedAt: null, assetNo: ASSET-0009, assetName: Epson Home Cinema 4010 Projector 2023 #009-JAJ, assetDescription: A projector used in government offices and departments., assetImage: /uploads/assets_base_record_images/ASSET-0009-1763346953615.webp, manufacturer: Epson, acquisitionCost: 25650.29, currentQuantity: 4, acquisitionDate: 2023-11-22T16:00:00.000Z, warrantyDate: 2025-11-22T16:00:00.000Z, purchaseOrderNo: PO-226965, supplier: OfficePro Trading, supplierContactNo: 09985554433, supplierContactEmail: info@officepro.com, purchaseDate: 2023-11-08T16:00:00.000Z, deliveryDate: 2023-11-17T16:00:00.000Z, acquisitionType: Self Build, invoiceNo: INVOICE-NO-10857, invoiceAmount: 102601.16, isVerified: true, isApproved: true, isDraft: false, preparedBy: null, finalizedBy: null, verifiedBy: null, approvedBy: null, approvedAt: 2025-11-17T02:37:57.081Z, verifiedAt: 2025-11-17T02:37:25.618Z, depreciation: null, inventories: null, transactions: null, custodian: id: 019a75a4-1f21-733e-8344-b74100e41d29, version: 2, createdAt: 2025-11-12T01:18:01.505Z, updatedAt: 2025-11-12T01:18:01.505Z, deletedAt: null, user: null, issuedAsset: null, employeeId: EMP0002, firstName: Robert, middleName: , lastName: Brown, email: robert.brown2@example.com, contactNumber: 09171234502, position: Project Manager, department: Human Resources, isVerified: true, inventoryNo: ASSET-0009-INV-1, qrCode: /uploads/RVTM_AIMS_ASSET_inventory_qr/QR-ASSET-0009-INV-1.png, barCode: null, rfidTag: null, location: Quezon City, isDraft: false, status: Issued\\n\\n[2] employees: version: 1, user: null, issuedAsset: [], employeeId: EMP0006, firstName: Daniel, middleName: , lastName: Miller, email: daniel.miller6@example.com, contactNumber: 09171234506, position: Network Admin, department: Sales, isVerified: false\\n\\n[3] employees: version: 1, user: null, issuedAsset: [], employeeId: EMP0009, firstName: Olivia, middleName: , lastName: Lopez, email: olivia.lopez9@example.com, contactNumber: 09171234509, position: Admin Assistant, department: Supply Chain, isVerified: false\\n\\n[4] employees: version: 1, user: null, issuedAsset: [], employeeId: EMP0010, firstName: Liam, middleName: , lastName: Anderson, email: liam.anderson10@example.com, contactNumber: 09171234510, position: Software Engineer, department: IT, isVerified: false\\n\\n[5] employees: version: 1, user: null, issuedAsset: [], employeeId: EMP0012, firstName: Noah, middleName: , lastName: Jackson, email: noah.jackson12@example.com, contactNumber: 09171234512, position: Project Manager, department: Human Resources, isVerified: false\\n\\n[6] employees: version: 1, user: null, issuedAsset: [], employeeId: EMP0014, firstName: James, middleName: , lastName: Harris, email: james.harris14@example.com, contactNumber: 09171234514, position: Accountant, department: Design, isVerified: false\\n\\n[7] employees: version: 1, user: null, issuedAsset: [], employeeId: EMP0015, firstName: Ava, middleName: , lastName: Martin, email: ava.martin15@example.com, contactNumber: 09171234515, position: UI/UX Designer, department: Marketing, isVerified: false\\n\\n[8] employees: version: 1, user: null, issuedAsset: [], employeeId: EMP0016, firstName: William, middleName: , lastName: Thompson, email: william.thompson16@example.com, contactNumber: 09171234516, position: Network Admin, department: Sales, isVerified: false\\n\\n[9] employees: version: 1, user: null, issuedAsset: [], employeeId: EMP0017, firstName: Mia, middleName: , lastName: Clark, email: mia.clark17@example.com, contactNumber: 09171234517, position: Marketing Specialist, department: Administration, isVerified: false\\n\\n[10] employees: version: 1, user: null, issuedAsset: [], employeeId: EMP0018, firstName: Benjamin, middleName: , lastName: Rodriguez, email: benjamin.rodriguez18@example.com, contactNumber: 09171234518, position: Sales Executive, department: Customer Service, isVerified: false\\n\\n[11] employees: version: 1, user: null, issuedAsset: [], employeeId: EMP0019, firstName: Charlotte, middleName: , lastName: Lewis, email: charlotte.lewis19@example.com, contactNumber: 09171234519, position: Admin Assistant, department: Supply Chain, isVerified: false\\n\\n💡 Note: Custodian = Current employee assigned to this item", "contextUsed": true, "performance": {"tokensUsed": 41, "responseTimeMs": 1547}}	1	\N
2025-11-17 15:27:15.550598+08	2025-11-17 15:27:15.550598+08	019a90b5-f65d-740a-af95-72a9fe5ccf1d	019a90b4-1559-7221-85bd-5f339ca0c34b	user	how about this one? ASSET-0007-INV-2	{"timestamp": "2025-11-17T07:27:15.548Z"}	1	\N
2025-11-17 15:27:24.151313+08	2025-11-17 15:27:24.151313+08	019a90b6-17f5-75ef-a6fd-ab8f5a534998	019a90b4-1559-7221-85bd-5f339ca0c34b	assistant	According to the database, the current status of the asset ASSET-0007-INV-2 is:\n\nStatus: For-Transfer	{"modelUsed": "meta/meta-llama-3-8b-instruct", "timestamp": "2025-11-17T07:27:24.148Z", "ragContext": "[1] assets_inventory: version: 3, asset: id: 019a75cb-233c-711f-a2e9-6d0404da7905, version: 3, createdAt: 2025-11-12T02:00:38.482Z, updatedAt: 2025-11-12T02:00:38.482Z, deletedAt: null, assetNo: ASSET-0007, assetName: Panasonic CS/CU-XU18UKY Air Conditioner 2018 #007-FG5, assetDescription: A air conditioner used in government offices and departments., assetImage: , manufacturer: Panasonic, acquisitionCost: 77849.25, currentQuantity: 10, acquisitionDate: 2018-03-16T16:00:00.000Z, warrantyDate: 2020-03-16T16:00:00.000Z, purchaseOrderNo: PO-790285, supplier: GadgetWorks Inc., supplierContactNo: 09221234567, supplierContactEmail: support@gadgetworks.com, purchaseDate: 2018-03-12T16:00:00.000Z, deliveryDate: 2018-03-16T16:00:00.000Z, acquisitionType: Lease, invoiceNo: INVOICE-NO-97351, invoiceAmount: 778492.50, isVerified: true, isApproved: false, isDraft: false, preparedBy: null, finalizedBy: null, verifiedBy: null, approvedBy: null, approvedAt: null, verifiedAt: 2025-11-17T03:15:12.068Z, depreciation: null, inventories: null, transactions: null, custodian: id: 019a75a4-1f21-733e-8344-cff48770b8fe, version: 2, createdAt: 2025-11-12T01:18:01.505Z, updatedAt: 2025-11-12T01:18:01.505Z, deletedAt: null, user: null, issuedAsset: null, employeeId: EMP0008, firstName: Kevin, middleName: , lastName: Martinez, email: kevin.martinez8@example.com, contactNumber: 09171234508, position: Sales Executive, department: Customer Service, isVerified: true, inventoryNo: ASSET-0007-INV-2, qrCode: /uploads/RVTM_AIMS_ASSET_inventory_qr/QR-ASSET-0007-INV-2.png, barCode: null, rfidTag: null, location: null, isDraft: false, status: For-Transfer", "contextUsed": true, "performance": {"tokensUsed": 20, "responseTimeMs": 813}}	1	\N
2025-11-17 15:28:10.594434+08	2025-11-17 15:28:10.594434+08	019a90b6-cd62-732b-ab49-03edd6bb8dea	019a90b4-1559-7221-85bd-5f339ca0c34b	user	are you sure ? for ASSET-0007-INV-2 ?	{"timestamp": "2025-11-17T07:28:10.592Z"}	1	\N
2025-11-18 15:37:17.84611+08	2025-11-18 15:37:17.84611+08	019a95e5-8315-737a-9731-96c539619a2a	019a90b4-1559-7221-85bd-5f339ca0c34b	user	what is the current status of this asset ASSET-0007-INV-2	{"timestamp": "2025-11-18T07:37:17.844Z"}	1	\N
2025-11-18 15:37:26.795976+08	2025-11-18 15:37:26.795976+08	019a95e5-a60a-7494-821d-1353df5d2e25	019a90b4-1559-7221-85bd-5f339ca0c34b	assistant	I apologize for the earlier mistake. According to the database, there is no information available for the asset ASSET-0007-INV-2. The initial message stated that "No inventory item found with number 'ASSET-0007-INV-2'. Please verify the inventory number is correct."	{"modelUsed": "meta/meta-llama-3-8b-instruct", "timestamp": "2025-11-18T07:37:26.792Z", "ragContext": "No inventory item found with number \\"ASSET-0007-INV-2\\". Please verify the inventory number is correct.", "contextUsed": true, "performance": {"tokensUsed": 51, "responseTimeMs": 1169}}	1	\N
2025-11-18 15:39:11.051445+08	2025-11-18 15:39:11.051445+08	019a95e7-3d4b-709c-9af6-434572a2b4f0	019a90b4-1559-7221-85bd-5f339ca0c34b	user	when ?? what is the date of transaction date ?	{"timestamp": "2025-11-18T07:39:11.050Z"}	1	\N
2025-11-18 15:39:18.134154+08	2025-11-18 15:39:18.134154+08	019a95e7-58f6-768d-ac60-17327f34c1b7	019a90b4-1559-7221-85bd-5f339ca0c34b	assistant	According to the database, the transaction date for the asset ASSET-0007-INV-2, Panasonic CS/CU-XU18UKY Air Conditioner, is:\n\nTransaction Date: 2025-11-17T02:21:00.000Z	{"modelUsed": "meta/meta-llama-3-8b-instruct", "timestamp": "2025-11-18T07:39:18.130Z", "ragContext": "[1] asset_transactions: version: 1, inventory: null, custodian: null, parNo: Human Resources-2025-EMP0002-001, transactionNo: DAI-202511-0001, transactionType: direct_issuance, fromStatus: New-Available, toStatus: Issued, repairEmployee: null, repairVendor: null, repairCost: null, repairDescription: null, estimatedCompletionDate: null, disposalMethod: null, disposalValue: null, disposalVendor: null, disposalCertificate: null, transferFromLocation: null, transferToLocation: null, transferFromDepartment: null, transferToDepartment: null, incidentDate: null, incidentDescription: null, policeReportNumber: null, insuranceClaimNumber: null, preparedBy: null, approvedBy: null, rejectedBy: null, approvalStatus: approved, approvedAt: 2025-11-17T02:21:00.000Z, rejectedAt: null, rejectionReason: null, remarks: null, reason: null, isActive: true, attachments: null, transactionDate: 2025-11-17T02:21:00.000Z", "contextUsed": true, "performance": {"tokensUsed": 26, "responseTimeMs": 1135}}	1	\N
\.


--
-- Data for Name: chat_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_sessions (created_at, updated_at, id, title, sender_id, version, deleted_at) FROM stdin;
2025-11-17 15:25:12.41062+08	2025-11-18 15:39:18.145+08	019a90b4-1559-7221-85bd-5f339ca0c34b	Asset Custodian Identification Request	01997ac6-c5bb-7589-b79f-a6509ea5d44a	10	\N
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, version, created_at, updated_at, deleted_at, employee_id, first_name, middle_name, last_name, email, contact_number, "position", department, is_verified) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, title, description, url_params, actions, status, author, "timestamp", deleted_at, created_at, updated_at, version) FROM stdin;
019ab9dc-24b1-731f-bce9-563a457cc4ba	User Account Created	User Account Created Employee Demo	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-11-25 15:13:23.633837+08	\N	2025-11-25 15:13:23.633837+08	2025-11-25 15:13:23.633837+08	1
019ab9df-f129-71fd-b278-4145339ab798	User Account Created	User Account Created HR Administrator	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-11-25 15:17:32.585451+08	\N	2025-11-25 15:17:32.585451+08	2025-11-25 15:17:32.585451+08	1
019ab9e1-5245-7203-bd47-6c7f6e150c24	User Account Created	User Account Created HR Manager	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-11-25 15:19:02.981739+08	\N	2025-11-25 15:19:02.981739+08	2025-11-25 15:19:02.981739+08	1
019ab9e2-7d4a-728f-953c-b224962566f6	User Account Created	User Account Created HR Staff	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-11-25 15:20:19.531172+08	\N	2025-11-25 15:20:19.531172+08	2025-11-25 15:20:19.531172+08	1
019ab9e3-801c-711c-84cd-d3228a5e80e3	User Account Created	User Account Created Accountant Demo	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-11-25 15:21:25.789105+08	\N	2025-11-25 15:21:25.789105+08	2025-11-25 15:21:25.789105+08	1
019ab9e5-9945-753f-9f5c-a2fa13b3ef80	User Account UPDATED	User Account UPDATED System Administrator	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-11-25 15:23:43.301582+08	\N	2025-11-25 15:23:43.301582+08	2025-11-25 15:23:43.301582+08	1
019ab9e8-9cf3-768b-b44e-f5c85bf11d1f	User Account UPDATED	User Account UPDATED HR Administrator	\N	READ	NORMAL	01997ac6-c5bb-7589-b79f-a6509ea5d44a	2025-11-25 15:27:00.851558+08	\N	2025-11-25 15:27:00.851558+08	2025-11-25 15:27:00.851558+08	1
019ab9f0-7888-72af-aa0e-b375d1310927	User Account UPDATED	User Account UPDATED HR Manager	\N	READ	NORMAL	019ab9df-f11e-712b-827d-2a701cc0aa2d	2025-11-25 15:35:35.81623+08	\N	2025-11-25 15:35:35.81623+08	2025-11-25 15:35:35.81623+08	1
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, permission, description, created_at, updated_at, version, deleted_at) FROM stdin;
0199b8a1-8c49-774a-849a-b354dd5fc460	Export	Allows the user to export content.	2025-10-06 16:26:59.017817	2025-10-13 15:20:51.041851	2	\N
0199b8a1-7c0d-710f-9ba5-538c047473ce	Delete	Allows the user to remove content.	2025-10-06 16:26:54.862387	2025-10-13 15:21:09.515201	2	\N
0199b8a1-6889-74b8-8e8b-1f4417b0ce07	Update	Allows the user to modify existing content.	2025-10-06 16:26:49.866119	2025-10-13 15:21:21.771834	2	\N
0199b89f-7259-759a-8708-d8b1c2236d49	Create	Allows the user to create new content.	2025-10-06 16:24:41.304126	2025-10-13 15:21:35.948493	2	\N
0199dc71-25c2-719f-b489-6bc026086c4e	View	Allows the user to view and read content.test	2025-10-13 15:20:26.81978	2025-10-16 13:33:07.766429	2	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, role, description, created_at, updated_at, version, deleted_at) FROM stdin;
01997a38-a91d-7288-b61b-49329c911b5d	Moderator	System Moderator	2025-09-24 13:35:57.724763	2025-09-30 13:14:15.815209	2	\N
019979a8-362a-7509-a04d-3404c42ebaa3	User	System User	2025-09-24 10:58:11.11437	2025-09-30 13:14:25.66666	2	\N
0199799e-a53c-712a-a759-5fee5d7e0cf5	Administrator	System Administrator	2025-09-24 10:47:44.187323	2025-09-30 13:14:36.101577	2	\N
019ab9a1-6b08-703a-b9b1-c5edb3acd354	HR-Manager	HR-Manager	2025-11-25 14:09:15.017146	2025-11-25 14:09:15.017146	1	\N
019ab9a1-4282-722a-a846-6e7e527bb29c	HR-Administrator	HR-Administrator	2025-11-25 14:09:04.642408	2025-11-25 14:09:21.383194	2	\N
019ab9a1-1a33-733f-aa4e-2dffc6464949	Employee	Employee	2025-11-25 14:08:54.323353	2025-11-25 14:09:28.950232	2	\N
019ab9a2-e1f0-718e-bfb1-01b452e7e567	HR-Staff	HR-Staff	2025-11-25 14:10:50.992367	2025-11-25 14:10:50.992367	1	\N
019ab9a2-faa4-70f2-8888-1b628b93598f	Accountant	Accountant	2025-11-25 14:10:57.316175	2025-11-25 14:10:57.316175	1	\N
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, "ipAddress", device, "userId", "expiresAt", created_at, deleted_at, updated_at, version) FROM stdin;
019ab9fb-bff7-708f-bcba-5e6f997aef3d	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	019ab9df-f11e-712b-827d-2a701cc0aa2d	2025-11-26 15:47:54.999+08	2025-11-25 15:47:55.000323+08	\N	2025-11-25 15:47:55.000323+08	1
\.


--
-- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_permissions (id, "userId", "permissionId", created_at, updated_at, version, deleted_at, user_id, permission_id) FROM stdin;
4d86372d-424e-49c6-8e3e-80902cfd9b91	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199dc71-25c2-719f-b489-6bc026086c4e	2025-10-13 15:31:18.665554	2025-10-13 15:31:18.665554	1	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199dc71-25c2-719f-b489-6bc026086c4e
87f3e9e0-a0a1-43b0-aeef-6488bd77fa0f	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-10-07 09:42:40.015538	2025-10-07 09:42:40.015538	1	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-7c0d-710f-9ba5-538c047473ce
f839b6d6-5e03-4870-a0df-af1729df5594	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-10-07 09:42:40.015538	2025-10-07 09:42:40.015538	1	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-8c49-774a-849a-b354dd5fc460
03910af4-8768-4fa2-91dd-9c56944316f2	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-11-19 10:17:28.646861	2025-11-19 10:17:28.646861	1	\N	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-8c49-774a-849a-b354dd5fc460
f6ddaa0e-3858-4730-a9d9-a53f0ab08416	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-11-19 10:17:28.646861	2025-11-19 10:17:28.646861	1	\N	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-7c0d-710f-9ba5-538c047473ce
26b27af6-76ab-4b85-93a6-c9a63f638837	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-11-19 10:17:28.646861	2025-11-19 10:17:28.646861	1	\N	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
1be4f1b9-8744-4048-9da6-dfecdd513f24	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b89f-7259-759a-8708-d8b1c2236d49	2025-11-19 10:17:28.646861	2025-11-19 10:17:28.646861	1	\N	019a99e7-111f-732e-87fe-ae62fc6714d8	0199b89f-7259-759a-8708-d8b1c2236d49
665aee53-d4db-4ad5-b5a7-904f04d2cbad	019a99e7-111f-732e-87fe-ae62fc6714d8	0199dc71-25c2-719f-b489-6bc026086c4e	2025-11-19 10:17:28.646861	2025-11-19 10:17:28.646861	1	\N	019a99e7-111f-732e-87fe-ae62fc6714d8	0199dc71-25c2-719f-b489-6bc026086c4e
031c14ec-e48e-4386-a0cf-1659cef1bb3d	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b89f-7259-759a-8708-d8b1c2236d49	2025-10-07 09:42:40.015538	2025-10-07 09:42:40.015538	1	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b89f-7259-759a-8708-d8b1c2236d49
21b31e31-4902-443d-8953-5a2ab74c20e3	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-10-06 16:27:11.943596	2025-10-06 16:27:11.943596	1	\N	01997ac6-c5bb-7589-b79f-a6509ea5d44a	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
dc237e38-707d-4afc-98d5-b0982e2db166	019ab9dc-24a6-71ce-aef9-e5ddc1241291	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-11-25 15:13:23.655486	2025-11-25 15:13:23.655486	1	\N	019ab9dc-24a6-71ce-aef9-e5ddc1241291	0199b8a1-8c49-774a-849a-b354dd5fc460
d6b86720-b260-4aa3-89a2-b6550eefe788	019ab9dc-24a6-71ce-aef9-e5ddc1241291	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-11-25 15:13:23.655486	2025-11-25 15:13:23.655486	1	\N	019ab9dc-24a6-71ce-aef9-e5ddc1241291	0199b8a1-7c0d-710f-9ba5-538c047473ce
7d0516b7-2ca6-4b43-8cb4-615e8b62309c	019ab9dc-24a6-71ce-aef9-e5ddc1241291	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-11-25 15:13:23.655486	2025-11-25 15:13:23.655486	1	\N	019ab9dc-24a6-71ce-aef9-e5ddc1241291	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
1d03dbeb-5e92-4a80-873b-48f68f0e3569	019ab9dc-24a6-71ce-aef9-e5ddc1241291	0199b89f-7259-759a-8708-d8b1c2236d49	2025-11-25 15:13:23.655486	2025-11-25 15:13:23.655486	1	\N	019ab9dc-24a6-71ce-aef9-e5ddc1241291	0199b89f-7259-759a-8708-d8b1c2236d49
a37ec02d-1272-4580-a79c-49ce1cd76a1d	019ab9dc-24a6-71ce-aef9-e5ddc1241291	0199dc71-25c2-719f-b489-6bc026086c4e	2025-11-25 15:13:23.655486	2025-11-25 15:13:23.655486	1	\N	019ab9dc-24a6-71ce-aef9-e5ddc1241291	0199dc71-25c2-719f-b489-6bc026086c4e
2a66c835-e17e-4bfc-8ea2-1a4f6e2c6423	019ab9df-f11e-712b-827d-2a701cc0aa2d	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-11-25 15:17:32.60381	2025-11-25 15:17:32.60381	1	\N	019ab9df-f11e-712b-827d-2a701cc0aa2d	0199b8a1-8c49-774a-849a-b354dd5fc460
2ccc6931-b7fe-457f-be9c-059c83337668	019ab9df-f11e-712b-827d-2a701cc0aa2d	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-11-25 15:17:32.60381	2025-11-25 15:17:32.60381	1	\N	019ab9df-f11e-712b-827d-2a701cc0aa2d	0199b8a1-7c0d-710f-9ba5-538c047473ce
86f70a29-7012-4c31-a02f-297b3b9bae0c	019ab9df-f11e-712b-827d-2a701cc0aa2d	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-11-25 15:17:32.60381	2025-11-25 15:17:32.60381	1	\N	019ab9df-f11e-712b-827d-2a701cc0aa2d	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
e21611a9-b2bb-4c02-b2aa-99720aff2430	019ab9df-f11e-712b-827d-2a701cc0aa2d	0199b89f-7259-759a-8708-d8b1c2236d49	2025-11-25 15:17:32.60381	2025-11-25 15:17:32.60381	1	\N	019ab9df-f11e-712b-827d-2a701cc0aa2d	0199b89f-7259-759a-8708-d8b1c2236d49
a533b814-a6c6-4f63-a839-6162539f9824	019ab9df-f11e-712b-827d-2a701cc0aa2d	0199dc71-25c2-719f-b489-6bc026086c4e	2025-11-25 15:17:32.60381	2025-11-25 15:17:32.60381	1	\N	019ab9df-f11e-712b-827d-2a701cc0aa2d	0199dc71-25c2-719f-b489-6bc026086c4e
4e65eb57-8d15-4177-bf89-57f4b3d7d4e8	019ab9e1-523d-717d-88c1-cdaf880dcd50	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-11-25 15:19:03.000041	2025-11-25 15:19:03.000041	1	\N	019ab9e1-523d-717d-88c1-cdaf880dcd50	0199b8a1-8c49-774a-849a-b354dd5fc460
9d1c7d60-e03f-4026-8165-a968853efa05	019ab9e1-523d-717d-88c1-cdaf880dcd50	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-11-25 15:19:03.000041	2025-11-25 15:19:03.000041	1	\N	019ab9e1-523d-717d-88c1-cdaf880dcd50	0199b8a1-7c0d-710f-9ba5-538c047473ce
740496bd-6415-48b7-b47b-bef5edb7e688	019ab9e1-523d-717d-88c1-cdaf880dcd50	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-11-25 15:19:03.000041	2025-11-25 15:19:03.000041	1	\N	019ab9e1-523d-717d-88c1-cdaf880dcd50	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
e766617d-ff10-40cc-be56-e95d1e8b3fcd	019ab9e1-523d-717d-88c1-cdaf880dcd50	0199b89f-7259-759a-8708-d8b1c2236d49	2025-11-25 15:19:03.000041	2025-11-25 15:19:03.000041	1	\N	019ab9e1-523d-717d-88c1-cdaf880dcd50	0199b89f-7259-759a-8708-d8b1c2236d49
951dec24-812f-4d13-96a3-0fec38c72dd4	019ab9e1-523d-717d-88c1-cdaf880dcd50	0199dc71-25c2-719f-b489-6bc026086c4e	2025-11-25 15:19:03.000041	2025-11-25 15:19:03.000041	1	\N	019ab9e1-523d-717d-88c1-cdaf880dcd50	0199dc71-25c2-719f-b489-6bc026086c4e
abc13370-5250-4219-8b97-4b2811d321c1	019ab9e2-7d39-752c-a186-1acfd6d6bda7	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-11-25 15:20:19.550556	2025-11-25 15:20:19.550556	1	\N	019ab9e2-7d39-752c-a186-1acfd6d6bda7	0199b8a1-8c49-774a-849a-b354dd5fc460
452dc2a9-ff64-498b-aab7-acf3c2a4d11c	019ab9e2-7d39-752c-a186-1acfd6d6bda7	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-11-25 15:20:19.550556	2025-11-25 15:20:19.550556	1	\N	019ab9e2-7d39-752c-a186-1acfd6d6bda7	0199b8a1-7c0d-710f-9ba5-538c047473ce
aef2d421-6c5e-4952-9eca-ec2c3d83ea76	019ab9e2-7d39-752c-a186-1acfd6d6bda7	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-11-25 15:20:19.550556	2025-11-25 15:20:19.550556	1	\N	019ab9e2-7d39-752c-a186-1acfd6d6bda7	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
7ea83b7c-cc2c-4618-971c-d336e0794324	019ab9e2-7d39-752c-a186-1acfd6d6bda7	0199b89f-7259-759a-8708-d8b1c2236d49	2025-11-25 15:20:19.550556	2025-11-25 15:20:19.550556	1	\N	019ab9e2-7d39-752c-a186-1acfd6d6bda7	0199b89f-7259-759a-8708-d8b1c2236d49
a4322082-999f-40f5-8e7c-303322816bc8	019ab9e2-7d39-752c-a186-1acfd6d6bda7	0199dc71-25c2-719f-b489-6bc026086c4e	2025-11-25 15:20:19.550556	2025-11-25 15:20:19.550556	1	\N	019ab9e2-7d39-752c-a186-1acfd6d6bda7	0199dc71-25c2-719f-b489-6bc026086c4e
3bb45604-05b0-4cec-b430-92034e7234bd	019ab9e3-8011-726e-99a6-50836e8f84bc	0199b8a1-8c49-774a-849a-b354dd5fc460	2025-11-25 15:21:25.809698	2025-11-25 15:21:25.809698	1	\N	019ab9e3-8011-726e-99a6-50836e8f84bc	0199b8a1-8c49-774a-849a-b354dd5fc460
01a018a4-2e7c-471a-b63d-d9b6e66facbe	019ab9e3-8011-726e-99a6-50836e8f84bc	0199b8a1-7c0d-710f-9ba5-538c047473ce	2025-11-25 15:21:25.809698	2025-11-25 15:21:25.809698	1	\N	019ab9e3-8011-726e-99a6-50836e8f84bc	0199b8a1-7c0d-710f-9ba5-538c047473ce
b36511dd-e248-42fd-b1e4-fdaa186286a0	019ab9e3-8011-726e-99a6-50836e8f84bc	0199b8a1-6889-74b8-8e8b-1f4417b0ce07	2025-11-25 15:21:25.809698	2025-11-25 15:21:25.809698	1	\N	019ab9e3-8011-726e-99a6-50836e8f84bc	0199b8a1-6889-74b8-8e8b-1f4417b0ce07
83a9b9b7-67a0-4842-a496-59fd0a853917	019ab9e3-8011-726e-99a6-50836e8f84bc	0199b89f-7259-759a-8708-d8b1c2236d49	2025-11-25 15:21:25.809698	2025-11-25 15:21:25.809698	1	\N	019ab9e3-8011-726e-99a6-50836e8f84bc	0199b89f-7259-759a-8708-d8b1c2236d49
e7fabfc8-3763-4bd1-adc5-62927dadb2db	019ab9e3-8011-726e-99a6-50836e8f84bc	0199dc71-25c2-719f-b489-6bc026086c4e	2025-11-25 15:21:25.809698	2025-11-25 15:21:25.809698	1	\N	019ab9e3-8011-726e-99a6-50836e8f84bc	0199dc71-25c2-719f-b489-6bc026086c4e
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, user_name, email, password, failed_attempts, version, role_id, profile_image, pass_key, access, lockout_until, deleted_at, created_at, updated_at, employee_id) FROM stdin;
019a99e7-111f-732e-87fe-ae62fc6714d8	System Moderator	@moderator	moderator@email.com	$2b$10$CRMbvc.dh/coMc6NLksfTOq/P4/ux2R3kvhG4zsfo3YaNW5997z2W	0	6	01997a38-a91d-7288-b61b-49329c911b5d	/uploads/users_profile_images/System Moderator-1763518761026.png	$2b$10$mvvtPfX2cc4JX.odjW/PJ.b3CbPBZ9B.bISim151RMvBXGBHzxK9e	["/dashboard","/academic","/student-records","/timetable","/examinations","/certificates","/documents","/announcements","/admin/users","/admin/roles","/admin/permissions","/admin/audit-logs","/admin/audit-logs","/my-students","/schedule","/attendance","/my-examinations","/my-schedule","/my-grades","/assignments","/exam-schedule","/my-certificates","/my-documents"]	\N	\N	2025-11-19 10:17:28.608+08	2025-11-19 10:17:28.608+08	\N
019ab9dc-24a6-71ce-aef9-e5ddc1241291	Employee Demo	@employee-demo	employee@mail.com	$2b$10$1IbF0fuBkmkKp.WowNeKduP0PU3vPMfMcT9a0Y6W4BUnOYneImHEW	0	2	019ab9a1-1a33-733f-aa4e-2dffc6464949	\N	$2b$10$rraCakMEHTn1LxIygdPrsugjmRTsAmRi6gaDzR55Ld8Ugs0D.uU22	["/dashboard","/profile","/account","/notifications","/announcements","/my-attendance","/my-schedule","/leave-requests","/payslips","/benefits","/my-documents","/my-performance","/my-certificates"]	\N	\N	2025-11-25 15:13:23.622+08	2025-11-25 15:13:23.622+08	\N
019ab9e1-523d-717d-88c1-cdaf880dcd50	HR Manager	@hr-manager	hrmanager@mail.com	$2b$10$udtInvGRyURuImPjCjfFdOf6EXvGrni0R5kDZkl45wGkcVKSsCGGC	0	4	019ab9a1-6b08-703a-b9b1-c5edb3acd354	\N	$2b$10$GJrBOmHO31LKXdg2IOhN7Onbi.waqZ0XH6triLqvARvFNzwZBKkLO	["/dashboard","/profile","/account","/notifications","/employee-records","/attendance-management","/schedule-management","/leave-management","/payroll-management","/benefits-management","/documents-management","/performance-management","/certificates-management","/reports","/announcements"]	\N	\N	2025-11-25 15:19:02.973+08	2025-11-25 15:19:02.973+08	\N
01997ac6-c5bb-7589-b79f-a6509ea5d44a	System Administrator	@admin	admin@email.com	$2b$10$Rf4GPpj4ZecQRcouop0Foe5GFdN2KBTYXqKULl.EJtp5wUVG.kbge	0	59	0199799e-a53c-712a-a759-5fee5d7e0cf5	/uploads/users_profile_images/System Administrator-1761726512573.png	$2b$10$jdV9D6RyqFw1dDPTTC1Xk.dqYVhSac/zgOu5KxRCHDiqhgk6Uevau	["/dashboard","/profile","/account","/announcements","/admin/users","/admin/roles","/admin/permissions","/admin/audit-logs","/notifications"]	\N	\N	2025-09-24 16:11:11.162+08	2025-11-04 16:44:24.886+08	\N
019ab9e2-7d39-752c-a186-1acfd6d6bda7	HR Staff	@hr-staff	hrstaff@mail.com	$2b$10$MGalWpaC40YI8XiMNXijKuIDom7.D.KqhVIRCO9tuZe2USPPmkSe.	0	2	019ab9a2-e1f0-718e-bfb1-01b452e7e567	\N	$2b$10$4k/.2HVkeYtKd8MkYuS7suS840cRo3OcG9uOyp24j.u8e16DXqFSC	["/dashboard","/profile","/account","/notifications","/announcements","/employee-records","/attendance-management","/schedule-management","/leave-management","/payroll-management","/benefits-management","/documents-management","/performance-management","/certificates-management","/reports"]	\N	\N	2025-11-25 15:20:19.514+08	2025-11-25 15:20:19.514+08	\N
019ab9e3-8011-726e-99a6-50836e8f84bc	Accountant Demo	@accountant-demo	accountant@mail.com	$2b$10$NJGEPOqb7egXGUuU3i2zoOC/mpumWpI/slUXtafJQPeydKe4WOvXa	0	2	019ab9a2-faa4-70f2-8888-1b628b93598f	\N	$2b$10$0vk7VGVqzUn9G8UJMloUaedofZ4zJCZKM0Q8Cq9rvForW1XaaQumG	["/dashboard","/profile","/account","/notifications","/announcements","/deductions","/allowances","/payslips-management","/reimbursements","/cash-advances","/government-reports","/tax-documents","/financial-statements"]	\N	\N	2025-11-25 15:21:25.777+08	2025-11-25 15:21:25.777+08	\N
019ab9df-f11e-712b-827d-2a701cc0aa2d	HR Administrator	@hr-admin	hradmin@mail.com	$2b$10$o3q/Pu7PT/dGIZ28WrKV/elekNbWDPVkuqWP2maogoUtGVwHaF.w6	0	6	019ab9a1-4282-722a-a846-6e7e527bb29c	\N	$2b$10$.WiFel3cKp1U/42AD9LAW.bRy0F.kW7dv9kvbBl9eAqFo2aNVn0xi	["/dashboard","/profile","/account","/notifications","/announcements","/admin/users","/admin/roles","/admin/permissions","/admin/audit-logs","/employee-records","/attendance-management","/schedule-management","/leave-management","/payroll-management","/benefits-management","/documents-management","/performance-management","/certificates-management","/reports"]	\N	\N	2025-11-25 15:17:32.574+08	2025-11-25 15:17:32.574+08	\N
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- Name: user_permissions PK_01f4295968ba33d73926684264f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "PK_01f4295968ba33d73926684264f" PRIMARY KEY (id);


--
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


--
-- Name: sessions PK_3238ef96f18b355b671619111bc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY (id);


--
-- Name: chat_messages PK_40c55ee0e571e268b0d3cd37d10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY (id);


--
-- Name: chat_embeddings PK_5839ddb1b6d9794b55b5e40fea7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_embeddings
    ADD CONSTRAINT "PK_5839ddb1b6d9794b55b5e40fea7" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: permissions PK_920331560282b8bd21bb02290df; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: employees PK_b9535a98350d5b26e7eb0c26af4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: chat_sessions PK_efc151a4aafa9a28b73dedc485f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT "PK_efc151a4aafa9a28b73dedc485f" PRIMARY KEY (id);


--
-- Name: auth_logs PK_f4ee581a4a56f10b64ffbfc1779; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_logs
    ADD CONSTRAINT "PK_f4ee581a4a56f10b64ffbfc1779" PRIMARY KEY (id);


--
-- Name: users UQ_074a1f262efaca6aba16f7ed920; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE (user_name);


--
-- Name: employees UQ_765bc1ac8967533a04c74a9f6af; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE (email);


--
-- Name: users UQ_9760615d88ed518196bb79ea03d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_9760615d88ed518196bb79ea03d" UNIQUE (employee_id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: employees UQ_c9a09b8e6588fb4d3c9051c8937; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "UQ_c9a09b8e6588fb4d3c9051c8937" UNIQUE (employee_id);


--
-- Name: roles UQ_ccc7c1489f3a6b3c9b47d4537c5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_ccc7c1489f3a6b3c9b47d4537c5" UNIQUE (role);


--
-- Name: permissions UQ_efcbbce13db89dbd3ef8b7690ae; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "UQ_efcbbce13db89dbd3ef8b7690ae" UNIQUE (permission);


--
-- Name: IDX_13270b51f461a0ebfc0808ef62; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_13270b51f461a0ebfc0808ef62" ON public.sessions USING btree ("userId", "expiresAt");


--
-- Name: IDX_3dc66dbf37e5f226ef06db37cf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3dc66dbf37e5f226ef06db37cf" ON public.auth_logs USING btree ("userId", timestamptz);


--
-- Name: chat_embeddings FK_0488cebe818bf7745b074f74757; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_embeddings
    ADD CONSTRAINT "FK_0488cebe818bf7745b074f74757" FOREIGN KEY (message_id) REFERENCES public.chat_messages(id) ON DELETE CASCADE;


--
-- Name: chat_messages FK_0672782561e44d43febcfba2984; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "FK_0672782561e44d43febcfba2984" FOREIGN KEY (session_id) REFERENCES public.chat_sessions(id) ON DELETE CASCADE;


--
-- Name: notifications FK_312d0b2167068d5f1fb30f5f673; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_312d0b2167068d5f1fb30f5f673" FOREIGN KEY (author) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_permissions FK_3495bd31f1862d02931e8e8d2e8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: auth_logs FK_564498ad3b1e8e338de48222381; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_logs
    ADD CONSTRAINT "FK_564498ad3b1e8e338de48222381" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions FK_57de40bc620f456c7311aa3a1e6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_permissions FK_8145f5fadacd311693c15e41f10; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT "FK_8145f5fadacd311693c15e41f10" FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: users FK_9760615d88ed518196bb79ea03d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_9760615d88ed518196bb79ea03d" FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: users FK_a2cecd1a3531c0b041e29ba46e1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: audit_logs FK_ae97aac6d6d471b9d88cea1c971; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "FK_ae97aac6d6d471b9d88cea1c971" FOREIGN KEY (performed_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_sessions FK_b00c8c8a886bc900d58b4610761; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT "FK_b00c8c8a886bc900d58b4610761" FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict d37zbRC6bgDdFuxAP4fxxlCSYct6qz64dgJE3qxgXcaVo9CKp1Fuen31aViqkcE

