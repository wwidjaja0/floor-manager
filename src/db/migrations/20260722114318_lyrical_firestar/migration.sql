CREATE TABLE `approved_domains` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`guild_id` text NOT NULL,
	`domain` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `guild_settings` (
	`guild_id` text PRIMARY KEY,
	`verified_role_id` text,
	`verification_channel_id` text,
	`code_expiry_minutes` integer DEFAULT 15 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verification_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`code_hash` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verified_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`guild_id` text NOT NULL,
	`user_id` text NOT NULL,
	`email` text,
	`verified_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `approved_domains_guild_domain_idx` ON `approved_domains` (`guild_id`,`domain`);--> statement-breakpoint
CREATE UNIQUE INDEX `verified_users_guild_user_idx` ON `verified_users` (`guild_id`,`user_id`);