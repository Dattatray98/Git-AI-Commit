import { openDb } from "./database_setup";
import { chats, message } from "../types/chats";

export const initialize_database = async () => {
    try {
        const db = await openDb();
        await db.execute(`
            CREATE TABLE IF NOT EXISTS chats(
                chat_Id VARCHAR(100) PRIMARY KEY,
                chat_title VARCHAR(150)
            )
        `);

        await db.execute(
            `
            CREATE TABLE IF NOT EXISTS messages(
                message_Id VARCHAR(100) PRIMARY KEY,
                chat_Id VARCHAR(100),
                user_message TEXT,
                ai_message TEXT,
                FOREIGN KEY (chat_Id) REFERENCES chats(chat_Id) ON DELETE CASCADE
            )`
        )
    } catch (error: any) {
        console.error("Database initialization failed:", error);
        throw error;
    }
};

export const insert_message = async (
    message_Id: string,
    chat_Id: string,
    user_message: string,
    ai_message: string,
    chat_title: string = "New Chat" // Added default title fallback
) => {
    try {
        const db = await openDb();

        // 1. Ensure the parent chat exists so the foreign key constraint passes
        await db.execute({
            sql: "INSERT OR IGNORE INTO chats(chat_Id, chat_title) VALUES(?, ?)",
            args: [chat_Id, chat_title]
        });

        // 2. Insert the actual message safely
        await db.execute({
            sql: 'INSERT INTO messages(message_Id, chat_Id, user_message, ai_message) VALUES(?,?,?,?)',
            args: [message_Id, chat_Id, user_message, ai_message]
        });

    } catch (error: any) {
        throw error; // Fixed: removed 'new'
    }
};


export const clearChats = async () => {
    try {
        const db = await openDb();

        await db.execute("DELETE FROM chats");
        await db.execute("DELETE FROM messages");
        return "chats cleared"
    } catch (error) {
        throw error;
    }
}