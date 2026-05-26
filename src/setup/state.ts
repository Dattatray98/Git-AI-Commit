import * as fs from "node:fs/promises";
import * as path from "node:path";
import { configDirPath } from "../config/config.js";



const filePath = path.join(configDirPath, "setup.json");


export interface setUpState {
    initialized: boolean;
    version: string;
}

export const isInitilized = async (): Promise<boolean> => {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}


export const loadSetup = async (): Promise<setUpState | null> => {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}


export const saveSetUp = async (state: setUpState): Promise<void> => {
    try {
        await fs.writeFile(filePath, JSON.stringify(state, null, 2));
    } catch (error) {
        console.error(error);
        throw error;
    }
}