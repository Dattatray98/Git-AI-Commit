import { createClient } from "@libsql/client";
import { configDirPath } from "../config/config.js";
import * as path from "node:path";
import * as fs from "node:fs/promises"
import { directories } from "../setup/directories.js";

export const openDb = async () => {
    try {

        const databasePath = path.join(directories.memory, "index.db");
        const db = createClient({
            url: `file:${databasePath}`
        });

        return db;

    } catch (error: any) {
        throw error
    }
}