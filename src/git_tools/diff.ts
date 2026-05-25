import {exec} from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function getStagedDiff(): Promise<string> {
    try{

        const {stdout} = await execAsync('git diff --staged');
        return stdout;
    }catch(error:any){
        console.error('Error reading git diff : ', error);
        throw error;
    }
}

