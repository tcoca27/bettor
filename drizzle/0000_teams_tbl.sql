CREATE TABLE IF NOT EXISTS "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"group" text NOT NULL,
	"position" text NOT NULL,
	"points" text NOT NULL,
	"image" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"api_id" text NOT NULL,
	"played" text NOT NULL,
	"wins" text NOT NULL,
	"draws" text NOT NULL,
	"losses" text NOT NULL,
	"goal_diff" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx" ON "teams" USING btree (api_id);