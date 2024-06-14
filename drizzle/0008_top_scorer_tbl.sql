CREATE TABLE IF NOT EXISTS "top_scorer_bet" (
	"id" serial PRIMARY KEY NOT NULL,
	"scorer_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"voter_id" text NOT NULL,
	"house_id" text NOT NULL,
	"image" text NOT NULL
);
