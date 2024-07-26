CREATE TABLE IF NOT EXISTS "audiobook-covers-next_image" (
	"id" uuid PRIMARY KEY NOT NULL,
	"source" text,
	"extension" text,
	"hash" text,
	"embedding" vector(768),
	"searchable" boolean,
	CONSTRAINT "audiobook-covers-next_image_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audiobook-covers-next_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "audiobook-covers-next_post" USING btree ("name");