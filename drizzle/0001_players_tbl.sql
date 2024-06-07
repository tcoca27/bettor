CREATE TABLE IF NOT EXISTS "scorers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"goals" text NOT NULL,
	"team_key" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scorers" ADD CONSTRAINT "scorers_team_key_teams_id_fk" FOREIGN KEY ("team_key") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
