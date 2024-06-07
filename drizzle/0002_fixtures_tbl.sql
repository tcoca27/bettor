CREATE TABLE IF NOT EXISTS "fixtures" (
	"id" serial PRIMARY KEY NOT NULL,
	"home_team" integer,
	"away_team" integer,
	"home_goals" text,
	"away_goals" text,
	"date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fixtures" ADD CONSTRAINT "fixtures_home_team_teams_id_fk" FOREIGN KEY ("home_team") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fixtures" ADD CONSTRAINT "fixtures_away_team_teams_id_fk" FOREIGN KEY ("away_team") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
