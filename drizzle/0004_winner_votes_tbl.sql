CREATE TABLE IF NOT EXISTS "winner_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"voter_id" text NOT NULL,
	"house_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fixture_votes" ADD COLUMN "house_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "winner_votes" ADD CONSTRAINT "winner_votes_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
