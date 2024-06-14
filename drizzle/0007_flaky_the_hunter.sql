CREATE TABLE IF NOT EXISTS "users_order" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"house_id" text NOT NULL,
	"position" text NOT NULL
);
