CREATE TABLE IF NOT EXISTS "score_bet" (
	"id" serial PRIMARY KEY NOT NULL,
	"home_goals" integer NOT NULL,
	"away_goals" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"voter_id" text NOT NULL,
	"house_id" text NOT NULL,
	"fixture_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "score_bet" ADD CONSTRAINT "score_bet_fixture_id_fixtures_id_fk" FOREIGN KEY ("fixture_id") REFERENCES "public"."fixtures"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
