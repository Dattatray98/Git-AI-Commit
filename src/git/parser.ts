import { FileChange } from "../types/filetypes";

export const parseDiff = (rawDiff:string): FileChange[] =>{
    const chunks = rawDiff.split('diff --git').filter(Boolean);

    return chunks.map(chunk => {
        const lines = chunk.split('\n');

        const fileMatch = lines[0].match(/a\/(.+) b\//);
        const file = fileMatch ? fileMatch[1] : "unknown";

        let additions = 0;
        let deletions = 0;

        for (const line of lines ){
            if (line.startsWith("+") && !line.startsWith("+++")) additions++;

            if (line.startsWith("-") && !line.startsWith('---')) deletions++;
        }

        return {file, additions, deletions, content:chunk};
    });
}