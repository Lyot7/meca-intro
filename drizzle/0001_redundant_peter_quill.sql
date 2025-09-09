CREATE TYPE "public"."user_role" AS ENUM('creator', 'client');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" NOT NULL,
	"status" "creator_status" DEFAULT 'active' NOT NULL,
	"description" text,
	"profile_image" text,
	"website" text,
	"social_media" json,
	"subscription_type" "subscription_type",
	"subscription_expires_at" timestamp with time zone,
	"subscription_active" boolean DEFAULT false,
	"bank_account" json,
	"phone" text,
	"date_of_birth" timestamp with time zone,
	"preferences" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
-- Migrate data from creators to users
INSERT INTO "users" (
	"id", "name", "email", "password_hash", "role", "status",
	"description", "profile_image", "website", "social_media",
	"subscription_type", "subscription_expires_at", "subscription_active",
	"bank_account", "created_at", "updated_at"
)
SELECT 
	"id", "name", "email", "password_hash", 
	CASE 
		WHEN "email" = 'admin@kpsull.com' THEN 'creator'::user_role
		WHEN "email" = 'createur@kpsull.com' THEN 'creator'::user_role
		ELSE 'client'::user_role
	END as "role",
	"status",
	"description", "profile_image", "website", "social_media",
	"subscription_type", "subscription_expires_at", "subscription_active",
	"bank_account", "created_at", "updated_at"
FROM "creators";
--> statement-breakpoint
ALTER TABLE "creators" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "creators" CASCADE;--> statement-breakpoint
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'carts_user_id_creators_id_fk') THEN
        ALTER TABLE "carts" DROP CONSTRAINT "carts_user_id_creators_id_fk";
    END IF;
END $$;
--> statement-breakpoint
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'orders_customer_id_creators_id_fk') THEN
        ALTER TABLE "orders" DROP CONSTRAINT "orders_customer_id_creators_id_fk";
    END IF;
END $$;
--> statement-breakpoint
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'products_creator_id_creators_id_fk') THEN
        ALTER TABLE "products" DROP CONSTRAINT "products_creator_id_creators_id_fk";
    END IF;
END $$;
--> statement-breakpoint
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'sessions_user_id_creators_id_fk') THEN
        ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_creators_id_fk";
    END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "featured_image" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "min_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "max_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "total_stock" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;