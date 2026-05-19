import { NavixConfig } from "../types/config";
import { saveConfig } from "./config"



export const setupConfig = async (provider: string, model: string): Promise<void> => {
    try {
        const configData: NavixConfig = {
            provider,
            model,
            updatedAt: new Date().toString()
        };

        await saveConfig(configData);

        console.log(`\n✨ Configuration initialized successfully!`);
        console.log(`👉 Provider set to: ${provider}`);
        console.log(`👉 Model set to:    ${model}\n`);

    } catch (error) {
        console.error('❌ Failed to run setupConfig:', error);
        throw error;
    }

}