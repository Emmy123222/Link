

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."AgreementType" AS ENUM (
    'privacy_agreement',
    'user_agreement'
);


ALTER TYPE "public"."AgreementType" OWNER TO "postgres";


CREATE TYPE "public"."BusinessType" AS ENUM (
    'Sole Trader',
    'Limited Company',
    'Limited Liability Partnership (LLP)',
    'Public sector organization',
    'Private customer'
);


ALTER TYPE "public"."BusinessType" OWNER TO "postgres";


CREATE TYPE "public"."CreationType" AS ENUM (
    'manually',
    'by other user'
);


ALTER TYPE "public"."CreationType" OWNER TO "postgres";


CREATE TYPE "public"."CurrencyType" AS ENUM (
    'GBP',
    'EUR',
    'USD'
);


ALTER TYPE "public"."CurrencyType" OWNER TO "postgres";


CREATE TYPE "public"."DocumentStatus" AS ENUM (
    'Draft',
    'Open',
    'Paid',
    'Delayed',
    'Late payment'
);


ALTER TYPE "public"."DocumentStatus" OWNER TO "postgres";


CREATE TYPE "public"."DocumentType" AS ENUM (
    'Payment request',
    'Invoice',
    'Planning Payment',
    'Bill'
);


ALTER TYPE "public"."DocumentType" OWNER TO "postgres";


CREATE TYPE "public"."PaymentMethod" AS ENUM (
    'Open banking',
    'Debit / Credit Card',
    'Bank transfer',
    'Cash',
    'Cheque'
);


ALTER TYPE "public"."PaymentMethod" OWNER TO "postgres";


CREATE TYPE "public"."PaymentServiceType" AS ENUM (
    'GlobalPay',
    'Crezco'
);


ALTER TYPE "public"."PaymentServiceType" OWNER TO "postgres";


CREATE TYPE "public"."Plan" AS ENUM (
    'FREE',
    'BRONZE',
    'SILVER',
    'GOLD',
    'FREE SMS',
    'STANDARD',
    'PREMIUM'
);


ALTER TYPE "public"."Plan" OWNER TO "postgres";


CREATE TYPE "public"."TaxOptions" AS ENUM (
    'Tax exclusive',
    'Tax inclusive',
    'No tax'
);


ALTER TYPE "public"."TaxOptions" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_to_paid_amount"("payment_request_id" bigint, "p_amount" numeric) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
declare
  new_amount numeric;
begin
  update public."Document_header"
  set paid_amount = paid_amount + p_amount
  where id = payment_request_id
  returning paid_amount into new_amount;

  return new_amount;
end;
$$;


ALTER FUNCTION "public"."add_to_paid_amount"("payment_request_id" bigint, "p_amount" numeric) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."append_changes_log"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  UPDATE public."Document_header"
  SET changes_log = COALESCE(changes_log, '[]'::jsonb) || change_entry
  WHERE id = doc_id;
END;$$;


ALTER FUNCTION "public"."append_changes_log"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."subtract_amount"("payment_request_id" integer, "amount" numeric) RETURNS integer
    LANGUAGE "plpgsql"
    AS $$declare
  new_amount numeric;
begin
  update payment_requests
  set paid_amount = paid_amount + amount
  where id = payment_request_id
  returning paid_amount into new_amount;

  return new_amount;
end;$$;


ALTER FUNCTION "public"."subtract_amount"("payment_request_id" integer, "amount" numeric) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Business category" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business_category" "text",
    CONSTRAINT "Business category_business_category_check" CHECK (("length"("business_category") <= 100))
);


ALTER TABLE "public"."Business category" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Businesses" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business_name" "text" DEFAULT ''::"text",
    "business_type" "public"."BusinessType",
    "business_category" bigint,
    "business_name_lowercase" "text" DEFAULT ''::"text",
    "name" "text" DEFAULT ''::"text",
    "lastname" "text" DEFAULT ''::"text",
    "registration_number" "text" DEFAULT ''::"text",
    "vat_number" "text" DEFAULT ''::"text",
    "email" "text" DEFAULT ''::"text",
    "business_payment_responsible_email" "text" DEFAULT ''::"text",
    "mobile_code_area" bigint,
    "mobile_phone_number" numeric,
    "telephone_code_area" bigint,
    "telephone_number" numeric,
    "fax_code_area" bigint,
    "fax" numeric,
    "countryCode" integer,
    "city" "text" DEFAULT ''::"text",
    "postal_code" "text" DEFAULT ''::"text",
    "street_1" "text" DEFAULT ''::"text",
    "street_2" "text" DEFAULT ''::"text",
    "website" "text" DEFAULT ''::"text",
    "currency" "public"."CurrencyType",
    "bank_account_name" "text" DEFAULT ''::"text",
    "bank_account_number" numeric,
    "sort_code" numeric,
    "active" boolean,
    "is_deleted" boolean,
    "isPrimaryBusiness" boolean,
    "OLD_Document ID" "text" DEFAULT ''::"text",
    "OLD_ownerId" "text" DEFAULT ''::"text",
    "OLD_createdBy" "text",
    "creation_type" "public"."CreationType",
    "business_setup_completion" "text",
    "guest_customers_payment_form" "text",
    "payment_integration" boolean,
    "accounting_integration" boolean,
    "xeroContactId" "text",
    "xero_integration_consent" boolean,
    "isNotSelect" boolean,
    "last_sync" timestamp without time zone,
    "partial_payments" boolean,
    "payment_request_tax" integer,
    "payment_terms" "text" DEFAULT ''::"text",
    "request_number" bigint,
    "invoice_number" bigint,
    "planning_number" bigint,
    "bill_number" bigint,
    "created_by" "uuid",
    "updated_by" "uuid",
    "createdBy" "text",
    "trade_name" "text",
    "ownerId" "uuid"
);


ALTER TABLE "public"."Businesses" OWNER TO "postgres";


ALTER TABLE "public"."Businesses" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Businesses_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Card Type" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."Card Type" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Country code" (
    "ID" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "countryName" "text" DEFAULT ''::"text",
    "countryCode" "text" DEFAULT ''::"text",
    "icon" "text" DEFAULT ''::"text",
    "phone_code" bigint
);


ALTER TABLE "public"."Country code" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Currency" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "currency" "text" DEFAULT ''::"text",
    "Description" "text" DEFAULT ''::"text"
);


ALTER TABLE "public"."Currency" OWNER TO "postgres";


ALTER TABLE "public"."Currency" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Currency_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Document_header" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid",
    "created_by_business" bigint,
    "document_type" "public"."DocumentType",
    "vendor_id" bigint,
    "customer_id" bigint,
    "currency" "public"."CurrencyType",
    "initial_amount" numeric(10,2),
    "amount" numeric(10,2),
    "paid_amount" numeric(10,2),
    "request_date" "date",
    "initial_supply_date" "date",
    "supply_date" "date",
    "initial_due_date" "date",
    "due_date" "date",
    "plan_due_date" "date",
    "receiving_date" "date",
    "closed_at" "date",
    "description" "text",
    "email_code" "text",
    "email_to_verify" "text",
    "partial_payments" boolean,
    "payment_done" boolean,
    "payment_method" "public"."PaymentMethod",
    "payment_request_tax" "public"."TaxOptions",
    "reference_number" "text",
    "remainder" numeric,
    "req_number" numeric,
    "sent_to_client" boolean,
    "status" "public"."DocumentStatus",
    "terms" "text",
    "wasDeleted" boolean,
    "xeroContactId" "text",
    "xeroInvoiceId" "text",
    "xeroInvoiceNumber" "text",
    "note" "text",
    "OLD_Document ID" "text",
    "guest_user" "uuid",
    "opened_by" "jsonb"[],
    "changes_log" "jsonb"[],
    "document_number" "text",
    "customer_owner_id" "uuid",
    "vendor_owner_id" "uuid",
    "payment_service_provider" "public"."PaymentServiceType",
    CONSTRAINT "positive_amount" CHECK (("amount" >= (0)::numeric))
);


ALTER TABLE "public"."Document_header" OWNER TO "postgres";


ALTER TABLE "public"."Document_header" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Document header_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Document items" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid",
    "doucment_header_id" bigint NOT NULL,
    "name" "text",
    "price" numeric(10,2),
    "currency" "public"."CurrencyType",
    "quantity" numeric(10,2),
    "tax" numeric,
    "note" "text"
);


ALTER TABLE "public"."Document items" OWNER TO "postgres";


ALTER TABLE "public"."Document items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Document items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Document transactions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "header_id" bigint NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid",
    "paymentDate" "date",
    "amount" numeric(10,2),
    "currency" "text",
    "type" "text",
    "method" "text",
    "card_type" "text",
    "description" "text",
    "status" "text"
);


ALTER TABLE "public"."Document transactions" OWNER TO "postgres";


ALTER TABLE "public"."Document transactions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Document transactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Legal agreements" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "agreed_on" timestamp without time zone,
    "agreement" "text",
    "revision_date" timestamp without time zone,
    "version" integer
);


ALTER TABLE "public"."Legal agreements" OWNER TO "postgres";


ALTER TABLE "public"."Legal agreements" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Legal agreements_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Messages" (
    "id" bigint NOT NULL,
    "sender_id" "uuid",
    "request_id" bigint,
    "type" "text",
    "message" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."Messages" OWNER TO "postgres";


ALTER TABLE "public"."Messages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Payment method" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text" DEFAULT ''::"text"
);


ALTER TABLE "public"."Payment method" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Payment services" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text" DEFAULT ''::"text",
    "business_id" bigint
);


ALTER TABLE "public"."Payment services" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Payment type" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."Payment type" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Phone area code" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "country" "text" DEFAULT ''::"text",
    "phone_code" "text" DEFAULT ''::"text"
);


ALTER TABLE "public"."Phone area code" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Static data" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "key" "text",
    "value" "jsonb"
);


ALTER TABLE "public"."Static data" OWNER TO "postgres";


ALTER TABLE "public"."Static data" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Static data_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Tax options" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text" DEFAULT ''::"text"
);


ALTER TABLE "public"."Tax options" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Tax percentage" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tax" numeric NOT NULL,
    "country" integer,
    "description" "text"
);


ALTER TABLE "public"."Tax percentage" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."User - Business" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business" bigint NOT NULL,
    "active" boolean
);


ALTER TABLE "public"."User - Business" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."User plans" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "plan" "text",
    "sms" "text",
    "paid_amount" numeric,
    "active" boolean
);


ALTER TABLE "public"."User plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Users" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "countryCode" integer,
    "email" "text" DEFAULT ''::"text",
    "name" "text" DEFAULT ''::"text",
    "lastname" "text" DEFAULT ''::"text",
    "defaultPaymentDocument" bigint,
    "phone" "text" DEFAULT ''::"text",
    "city" "text" DEFAULT ''::"text",
    "postal_code" "text" DEFAULT ''::"text",
    "street_1" "text" DEFAULT ''::"text",
    "street_2" "text" DEFAULT ''::"text",
    "label" bigint,
    "firebase_code" "text" DEFAULT ''::"text",
    "guest_user" boolean NOT NULL,
    "xero_userid" "text" DEFAULT ''::"text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."Users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Vendor - Customer" (
    "vendorId" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "customerId" bigint NOT NULL,
    "active" boolean
);


ALTER TABLE "public"."Vendor - Customer" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Verify email" (
    "id" bigint NOT NULL,
    "user_id" "text",
    "email" "text",
    "code" "text"
);


ALTER TABLE "public"."Verify email" OWNER TO "postgres";


ALTER TABLE "public"."Verify email" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Verify email_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Verify phone" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "phone_number" "text",
    "code" "text",
    "user_id" "uuid" DEFAULT "gen_random_uuid"()
);


ALTER TABLE "public"."Verify phone" OWNER TO "postgres";


ALTER TABLE "public"."Verify phone" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Verify phone_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."Business category"
    ADD CONSTRAINT "Business category_business_category_key" UNIQUE ("business_category");



ALTER TABLE ONLY "public"."Business category"
    ADD CONSTRAINT "Business category_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."Business category"
    ADD CONSTRAINT "Business category_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Card Type"
    ADD CONSTRAINT "Card Type_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."Card Type"
    ADD CONSTRAINT "Card Type_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Country code"
    ADD CONSTRAINT "Country Code_ID_key" UNIQUE ("ID");



ALTER TABLE ONLY "public"."Country code"
    ADD CONSTRAINT "Country Code_icon_key" UNIQUE ("countryName");



ALTER TABLE ONLY "public"."Country code"
    ADD CONSTRAINT "Country Code_icon_key1" UNIQUE ("countryCode");



ALTER TABLE ONLY "public"."Country code"
    ADD CONSTRAINT "Country Code_icon_key2" UNIQUE ("icon");



ALTER TABLE ONLY "public"."Country code"
    ADD CONSTRAINT "Country Code_pkey" PRIMARY KEY ("ID");



ALTER TABLE ONLY "public"."Currency"
    ADD CONSTRAINT "Currency_currency_key" UNIQUE ("currency");



ALTER TABLE ONLY "public"."Currency"
    ADD CONSTRAINT "Currency_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Document_header"
    ADD CONSTRAINT "Document header_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Document items"
    ADD CONSTRAINT "Document items_pkey" PRIMARY KEY ("id", "doucment_header_id");



ALTER TABLE ONLY "public"."Document transactions"
    ADD CONSTRAINT "Document transactions_pkey" PRIMARY KEY ("id", "header_id");



ALTER TABLE ONLY "public"."Legal agreements"
    ADD CONSTRAINT "Legal agreements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Messages"
    ADD CONSTRAINT "Messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Payment method"
    ADD CONSTRAINT "Payment method_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."Payment method"
    ADD CONSTRAINT "Payment method_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Payment services"
    ADD CONSTRAINT "Payment service provider_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."Payment services"
    ADD CONSTRAINT "Payment service provider_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Tax options"
    ADD CONSTRAINT "Payment tax_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."Tax options"
    ADD CONSTRAINT "Payment tax_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Payment type"
    ADD CONSTRAINT "Payment type_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."Payment type"
    ADD CONSTRAINT "Payment type_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Phone area code"
    ADD CONSTRAINT "Phone code_Phone_code_key" UNIQUE ("country");



ALTER TABLE ONLY "public"."Phone area code"
    ADD CONSTRAINT "Phone code_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."Phone area code"
    ADD CONSTRAINT "Phone code_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Static data"
    ADD CONSTRAINT "Static data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."User - Business"
    ADD CONSTRAINT "User - Business_pkey1" PRIMARY KEY ("id", "business");



ALTER TABLE ONLY "public"."User plans"
    ADD CONSTRAINT "User plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Users"
    ADD CONSTRAINT "Users_duplicate_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."Users"
    ADD CONSTRAINT "Users_duplicate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Tax percentage"
    ADD CONSTRAINT "Vat tax_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."Tax percentage"
    ADD CONSTRAINT "Vat tax_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Vendor - Customer"
    ADD CONSTRAINT "Vendor - Customer_pkey" PRIMARY KEY ("vendorId", "customerId");



ALTER TABLE ONLY "public"."Verify email"
    ADD CONSTRAINT "Verify email_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Verify phone"
    ADD CONSTRAINT "Verify phone_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_business_category_fkey" FOREIGN KEY ("business_category") REFERENCES "public"."Business category"("id");



ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "public"."Country code"("ID");



ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_fax_code_area_fkey" FOREIGN KEY ("fax_code_area") REFERENCES "public"."Phone area code"("id");



ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_mobile_code_area_fkey" FOREIGN KEY ("mobile_code_area") REFERENCES "public"."Phone area code"("id");



ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_payment_request_tax_fkey" FOREIGN KEY ("payment_request_tax") REFERENCES "public"."Tax options"("id");



ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_telephone_code_area_fkey" FOREIGN KEY ("telephone_code_area") REFERENCES "public"."Phone area code"("id");



ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_updated by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_updated by_fkey1" FOREIGN KEY ("updated_by") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Country code"
    ADD CONSTRAINT "Country Code_phone_code_fkey" FOREIGN KEY ("phone_code") REFERENCES "public"."Phone area code"("id");



ALTER TABLE ONLY "public"."Document_header"
    ADD CONSTRAINT "Document header_created_by_business_fkey" FOREIGN KEY ("created_by_business") REFERENCES "public"."Businesses"("id");



ALTER TABLE ONLY "public"."Document_header"
    ADD CONSTRAINT "Document header_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Document_header"
    ADD CONSTRAINT "Document header_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Businesses"("id");



ALTER TABLE ONLY "public"."Document_header"
    ADD CONSTRAINT "Document header_customer_owner_id_fkey" FOREIGN KEY ("customer_owner_id") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Document_header"
    ADD CONSTRAINT "Document header_guest_user_fkey" FOREIGN KEY ("guest_user") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Document_header"
    ADD CONSTRAINT "Document header_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Document_header"
    ADD CONSTRAINT "Document header_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."Businesses"("id");



ALTER TABLE ONLY "public"."Document_header"
    ADD CONSTRAINT "Document header_vendor_owner_id_fkey" FOREIGN KEY ("vendor_owner_id") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Document items"
    ADD CONSTRAINT "Document items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Document items"
    ADD CONSTRAINT "Document items_doucment_header_id_fkey" FOREIGN KEY ("doucment_header_id") REFERENCES "public"."Document_header"("id");



ALTER TABLE ONLY "public"."Document items"
    ADD CONSTRAINT "Document items_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Document transactions"
    ADD CONSTRAINT "Document transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Document transactions"
    ADD CONSTRAINT "Document transactions_header_id_fkey" FOREIGN KEY ("header_id") REFERENCES "public"."Document_header"("id");



ALTER TABLE ONLY "public"."Document transactions"
    ADD CONSTRAINT "Document transactions_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Legal agreements"
    ADD CONSTRAINT "Legal agreements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Payment services"
    ADD CONSTRAINT "Payment services_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."Businesses"("id");



ALTER TABLE ONLY "public"."Tax percentage"
    ADD CONSTRAINT "Tax percentage_country_fkey" FOREIGN KEY ("country") REFERENCES "public"."Country code"("ID");



ALTER TABLE ONLY "public"."User - Business"
    ADD CONSTRAINT "User - Business_business_fkey1" FOREIGN KEY ("business") REFERENCES "public"."Businesses"("id");



ALTER TABLE ONLY "public"."User - Business"
    ADD CONSTRAINT "User - Business_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Users"("id");



ALTER TABLE ONLY "public"."Users"
    ADD CONSTRAINT "Users_duplicate_area_code_fkey" FOREIGN KEY ("label") REFERENCES "public"."Phone area code"("id");



ALTER TABLE ONLY "public"."Users"
    ADD CONSTRAINT "Users_duplicate_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "public"."Country code"("ID");



ALTER TABLE ONLY "public"."Vendor - Customer"
    ADD CONSTRAINT "Vendor - Customer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Businesses"("id");



ALTER TABLE ONLY "public"."Vendor - Customer"
    ADD CONSTRAINT "Vendor - Customer_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Businesses"("id");



ALTER TABLE ONLY "public"."Verify phone"
    ADD CONSTRAINT "Verify phone_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE "public"."Card Type" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Currency" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable insert for authenticated users only" ON "public"."Users" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."Users" FOR SELECT USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."Businesses" FOR UPDATE USING (((( SELECT "auth"."jwt"() AS "jwt") ->> 'email'::"text") = "email")) WITH CHECK (((( SELECT "auth"."jwt"() AS "jwt") ->> 'email'::"text") = "email"));



CREATE POLICY "Enable update for users based on email" ON "public"."Users" FOR UPDATE USING (((( SELECT "auth"."jwt"() AS "jwt") ->> 'email'::"text") = "email")) WITH CHECK (((( SELECT "auth"."jwt"() AS "jwt") ->> 'email'::"text") = "email"));



ALTER TABLE "public"."Payment method" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Payment services" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Payment type" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Static data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Tax options" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Tax percentage" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Business category";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Businesses";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Card Type";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Country code";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Currency";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Document items";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Document transactions";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Document_header";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Legal agreements";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Payment method";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Payment services";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Payment type";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Phone area code";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Static data";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Tax options";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Tax percentage";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."User - Business";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Users";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."Vendor - Customer";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";












































































































