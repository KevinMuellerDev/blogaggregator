import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";
import type { Config } from "./src/config"

const config: Config = readConfig();
console.log(config.dbUrl)

export default defineConfig({
    schema: "src/lib/db/schema.ts",
    out: "src/lib/db/migrations/",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgres://fenrir:@localhost:5432/gator?sslmode=disable",
    },
});