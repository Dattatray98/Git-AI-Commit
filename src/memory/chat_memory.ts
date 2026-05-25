import { openDb } from "./database_setup.js";
import { Chat, Message } from "../types/chats.js";

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
                role VARCHAR(20) NOT NULL,
                Content TEXT NOT NULL,
                FOREIGN KEY (chat_Id) REFERENCES chats(chat_Id) ON DELETE CASCADE
            )`
        )
    } catch (error: any) {
        console.error("Database initialization failed:", error);
        throw error;
    }
};

export const insert_message = async (resMessage:Message) => {
    try {
        const db = await openDb();
        const chat_title = resMessage.content.slice(0, 25)

        // 1. Ensure the parent chat exists so the foreign key constraint passes
        await db.execute({
            sql: "INSERT OR IGNORE INTO chats(chat_Id, chat_title) VALUES(?, ?)",
            args: [resMessage.chat_Id, chat_title]
        });

        // 2. Insert the actual message safely
        await db.execute({
            sql: 'INSERT INTO messages(message_Id, chat_Id, role, content) VALUES(?,?,?,?)',
            args: [resMessage.message_Id, resMessage.chat_Id, resMessage.role, resMessage.content]
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