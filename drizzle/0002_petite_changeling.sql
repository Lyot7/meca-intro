ALTER TABLE "products" ADD COLUMN "price" numeric(10, 2);--> statement-breakpoint
UPDATE "products" SET "price" = COALESCE("min_price", 0.00);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "min_price";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "max_price";