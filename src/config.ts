import dotenv from "dotenv";

dotenv.config();

export const config= {
    OPENAI_API_KEY : process.env.OPENAI_API_KEY
};


export const validateConfig = ()=>{
    if (!config.OPENAI_API_KEY){
        console.error("Error : OPEN_API_KEY is missing in .env file");
        process.exit(1);
    }
}