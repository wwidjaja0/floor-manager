import "../load-env.js";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";
import { runMigrations } from "./migrate.js";
import { rootDir } from "../load-env.js";
import path from "node:path";

const dbPath = process.env.DATABASE_PATH
  ? path.isAbsolute(process.env.DATABASE_PATH)
    ? process.env.DATABASE_PATH
    : path.resolve(rootDir, process.env.DATABASE_PATH)
  : path.join(rootDir, "database.db");

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, {
  schema,
});

await runMigrations(db);

export { schema };
