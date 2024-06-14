CREATE TABLE IF NOT EXISTS "romania_bet" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"voter_id" text NOT NULL,
	"house_id" text NOT NULL,
	"prediction" text NOT NULL
);
