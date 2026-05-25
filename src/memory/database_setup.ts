import { createClient } from "@libsql/client";
import { configDirPath } from "../config/config";
import * as path from "node:path";
import * as fs from "node:fs/promises"

export const openDb = async () => {
    try {

        await fs.mkdir(configDirPath, { recursive: true });

        const databasePath = path.join(configDirPath, "index.db");
        const db = createClient({
            url:`file:${databasePath}`
        });

        return db;

    } catch (error: any) {
        throw error
    }
}