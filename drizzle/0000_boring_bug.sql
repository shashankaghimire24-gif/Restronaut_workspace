CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`restaurant_id` text NOT NULL,
	`kind` text NOT NULL,
	`note` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `activities_owner_idx` ON `activities` (`owner`);--> statement-breakpoint
CREATE TABLE `discovery_cache` (
	`key` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`expires` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `restaurants` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`dedupe` text NOT NULL,
	`payload` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `restaurants_owner_idx` ON `restaurants` (`owner`);--> statement-breakpoint
CREATE UNIQUE INDEX `restaurants_owner_dedupe_idx` ON `restaurants` (`owner`,`dedupe`);--> statement-breakpoint
CREATE TABLE `settings` (
	`owner` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL
);
