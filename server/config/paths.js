import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverDir = path.resolve(__dirname, "..");
const projectRoot = path.resolve(serverDir, "..");

const defaultUploadsDir = path.join(projectRoot, "uploads");
const defaultDataDir = path.join(serverDir, "data");
const defaultDbPath = path.join(serverDir, "db.json");

export const PATHS = {
  root: projectRoot,
  server: serverDir,
  uploads: process.env.UPLOADS_DIR || defaultUploadsDir,
  data: process.env.DATA_DIR || defaultDataDir,
  db: process.env.DB_PATH || defaultDbPath,
};

export default PATHS;
