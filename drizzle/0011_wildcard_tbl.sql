CREATE TABLE IF NOT EXISTS "wildcards" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"voter_id" text NOT NULL,
	"house_id" text NOT NULL,
	"wildcards" text NOT NULL,
	"stage" text NOT NULL
);
