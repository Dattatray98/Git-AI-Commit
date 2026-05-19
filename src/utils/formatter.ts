import { FileChange } from "../types/filetypes";

export const formateDiff = (changes: FileChange[]): string => {
    let prompt = 'Analyze the following code changes and generate a commit message.\n\n## Files Changed\n';

    for (const change of changes) {
        prompt += `\n### ${change.file}\n`;
        prompt += `Added : ${change.additions} lines, Removed : ${change.deletions} lines\n`;


        // truncate large diffs
        const content = change.content.length > 1000
            ? change.content.slice(0, 1000) + '\n...(truncated)'
            : change.content;

        prompt += '```\n' + content + '\n```\n';
    }

    return prompt;
}