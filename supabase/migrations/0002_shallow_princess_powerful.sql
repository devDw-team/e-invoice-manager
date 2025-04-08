CREATE TYPE "public"."billing_status" AS ENUM('미발송', '성공', '실패');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('사용', '미사용');--> statement-breakpoint
CREATE TYPE "public"."file_type" AS ENUM('html', 'excel', 'attachment');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('사용', '미사용');--> statement-breakpoint
CREATE TABLE "billing_invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_id" integer NOT NULL,
	"form_id" integer NOT NULL,
	"email" varchar(100) NOT NULL,
	"billing_month" varchar(7) NOT NULL,
	"payment_info" text,
	"details" json NOT NULL,
	"form_snapshot" json NOT NULL,
	"attachments" json,
	"status" "billing_status" DEFAULT '미발송' NOT NULL,
	"sent_at" timestamp,
	"created_by" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_by" varchar(50),
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "billing_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer NOT NULL,
	"sent_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"status" "billing_status" NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "invoice_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer NOT NULL,
	"file_type" "file_type" NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"path" varchar(255) NOT NULL,
	"size" integer NOT NULL,
	"mime_type" varchar(100),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "supplier_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_number" varchar(20) NOT NULL,
	"company_name" varchar(100) NOT NULL,
	"ceo" varchar(100) NOT NULL,
	"address" text NOT NULL,
	"business_type" varchar(100) NOT NULL,
	"item" varchar(100) NOT NULL,
	"seal_image_path" varchar(255),
	"updated_by" varchar(50) NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "vendor_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_id" integer NOT NULL,
	"branch" varchar(30),
	"email" varchar(100) NOT NULL,
	"status" "contact_status" DEFAULT '사용' NOT NULL,
	"created_by" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_by" varchar(50),
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "vendor_contacts_vendor_id_unique" UNIQUE("vendor_id")
);
--> statement-breakpoint
CREATE TABLE "vendor_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"vendor_id" integer NOT NULL,
	"invoice_items" json NOT NULL,
	"callcenter_info" text,
	"payment_description" text,
	"created_by" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_by" varchar(50),
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(20) NOT NULL,
	"ceo" varchar(100),
	"address" text,
	"business_type" varchar(100),
	"item" varchar(100),
	"invoice_status" "invoice_status" DEFAULT '사용' NOT NULL,
	"modifier" varchar(50) NOT NULL,
	"modified_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "vendors_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "billing_invoices" ADD CONSTRAINT "billing_invoices_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_invoices" ADD CONSTRAINT "billing_invoices_form_id_vendor_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."vendor_forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_logs" ADD CONSTRAINT "billing_logs_invoice_id_billing_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."billing_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_files" ADD CONSTRAINT "invoice_files_invoice_id_billing_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."billing_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_contacts" ADD CONSTRAINT "vendor_contacts_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_forms" ADD CONSTRAINT "vendor_forms_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;