CREATE TABLE IF NOT EXISTS "fixture_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"fixture_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"voter_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fixture_votes" ADD CONSTRAINT "fixture_votes_fixture_id_fixtures_id_fk" FOREIGN KEY ("fixture_id") REFERENCES "public"."fixtures"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
