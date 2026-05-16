import { exec } from "child_process";
import { promisify } from "util";


const execAsync = promisify(exec);


export const GitCommit = async (message: string) => {
    try {
        const { stdout } = await execAsync(`git commit -m ${JSON.stringify(message)}`);
        return stdout;

    } catch (error) {
        console.error("Error while git commit ", error);
        return "";
    }
}