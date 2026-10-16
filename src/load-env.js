import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

/** Load repo-root `.env` regardless of process cwd (npm start, systemd, etc.). */
const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
dotenv.config({ path: path.join(rootDir, ".env") });

export { rootDir };
