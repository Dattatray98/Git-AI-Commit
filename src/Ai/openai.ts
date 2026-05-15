import OpenAI from "openai";
import { config } from "../config";

config.OPEN_API_KEY;

export const openai = new OpenAI({
    apiKey: config.OPEN_API_KEY
});