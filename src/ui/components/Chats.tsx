import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { TextInput } from './TextInput.js';
import { generateWith } from '../../models/index.js';
import { initialize_database, insert_message } from '../../memory/chat_memory.js';
import { Message } from '../../types/chats.js';
import { randomUUID } from 'node:crypto';
import { findRelavantTool } from '../../utils/semanticSearch.js';
import { buildPlannerPrompt } from '../../utils/prompt.js';


export const Chats: React.FC<any> = ({ chat_Id }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    useInput((input, key) => {
        if (input === "Quit" || key.escape) {
            process.exit(0);
        }
    });

    const handleSubmit = async (value: string) => {
        const cleaned_input = value.trim();

        if (!cleaned_input || loading) {
            return;
        }

        if (cleaned_input === "exit()") {
            process.exit(1)
        }


        setLoading(true);

        await initialize_database();

        const userMessage: Message = {
            message_Id: randomUUID(),
            chat_Id: chat_Id,
            role: "user",
            content: cleaned_input
        }

        await insert_message(userMessage)

        const assistantMessage: Message = {
            message_Id: randomUUID(),
            chat_Id: chat_Id,
            role: "assistant",
            content: ""
        }

        setMessages(prev => [
            ...prev,
            userMessage,
            assistantMessage
        ]);

        // const tools = await findRelavantTool(cleaned_input);
        // const full_prompt = buildPlannerPrompt(cleaned_input, tools);

        try {
            const res = generateWith(cleaned_input);

            let full_response = "";

            for await (const chunk of res) {
                full_response += chunk;

                setMessages(prev =>
                    prev.map((msg: any) => {
                        if (msg.message_Id === assistantMessage.message_Id) {
                            return {
                                ...msg,
                                content: full_response
                            }
                        }

                        return msg;
                    })
                )
            }

            await insert_message(assistantMessage);


        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    message_Id: randomUUID(),
                    chat_Id: chat_Id,
                    role: "assistant",
                    content: 'Something went wrong.'
                }
            ])
            await insert_message(assistantMessage);
        } finally {
            setLoading(false);
        }
    }


    return (
        <Box flexDirection='column' padding={1}>
            <Text bold color="greenBright">Navix Assistant</Text>

            <Box marginTop={1} flexDirection='column'>
                {messages.length === 0 ? (
                    <Text color="gray">Start chatting with navix</Text>
                ) : (
                    messages.map((msg: Message) => (
                        <Box
                            key={msg.message_Id}
                            marginBottom={1}
                            borderStyle="round"
                            borderColor={
                                msg.role === "user" ? "cyan" : "green"
                            }
                            padding={1}
                        >
                            <Text>
                                <Text
                                    bold
                                    color={
                                        msg.role === "user" ? 'cyan' : 'greenBright'
                                    }
                                >
                                    {msg.role === "user" ? "you" : "Navix"}
                                </Text>
                                : {msg.content}
                            </Text>
                        </Box>
                    ))
                )}
            </Box>

            {loading && (
                <Box marginTop={1}>
                    <Text color="yellow">Navix is thinking...</Text>
                </Box>
            )}

            <Box marginTop={1}>
                <TextInput label='prompt : ' onSubmit={handleSubmit} />
            </Box>

            <Box marginTop={1}>
                <Text dimColor>
                    Press [Esc] or type exit() to quit
                </Text>
            </Box>
        </Box>
    )
}