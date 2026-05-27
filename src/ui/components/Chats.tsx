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
    const [thinking, setThinking] = useState(false);

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

        const tools = await findRelavantTool(cleaned_input);
        const full_prompt = await buildPlannerPrompt(cleaned_input, tools);

        setLoading(true);

        const userMessage: Message = {
            message_Id: randomUUID(),
            chat_Id: chat_Id.chat_Id,
            role: "user",
            content: full_prompt
        }

        await insert_message(userMessage.message_Id, userMessage.chat_Id, userMessage.role, cleaned_input)

        const assistantMessage: Message = {
            message_Id: randomUUID(),
            chat_Id: chat_Id.chat_Id,
            role: "assistant",
            content: ""
        }

        const thinkingMessage: Message = {
            message_Id: randomUUID(),
            chat_Id: chat_Id.chat_Id,
            role: "thinking",
            content: ""
        }

        setMessages(prev => [
            ...prev,
            userMessage
        ]);

        try {
            const res = await generateWith(full_prompt);


            let full_response = "";
            let thinkingText = '';

            assistantMessage.content = full_response;
            let isAssistantMessage = false;
            let isThinking = false;
            let thinkingAdded = false;

            for await (const chunk of res) {

                if (chunk.includes("<think>")) {
                    isThinking = true;
                    setThinking(true);
                    continue;
                }

                if (chunk.includes("</think>")) {
                    isThinking = false;
                    setThinking(false);
                    continue;
                }

                if (isThinking) {
                    thinkingText += chunk;
                } else {
                    full_response += chunk;
                }


                if (
                    isThinking &&
                    thinkingText.trim().length > 0
                ) {

                    if (!thinkingAdded) {

                        setMessages(prev => [
                            ...prev,
                            {
                                ...thinkingMessage,
                                content: thinkingText
                            }
                        ]);

                        thinkingAdded = true;

                    } else {

                        setMessages(prev =>
                            prev.map((msg: Message) => {

                                if (
                                    msg.message_Id ===
                                    thinkingMessage.message_Id
                                ) {

                                    return {
                                        ...msg,
                                        content: thinkingText
                                    };
                                }

                                return msg;
                            })
                        );
                    }
                }

                if (!isAssistantMessage && full_response.trim().length > 0) {
                    setMessages(prev => [
                        ...prev,
                        {
                            ...assistantMessage,
                            content: full_response
                        }
                    ]);
                    isAssistantMessage = true;
                } else if (isAssistantMessage) {
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
                    );

                }
            }

            await insert_message(assistantMessage.message_Id, assistantMessage.chat_Id, assistantMessage.role, full_response);


        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    message_Id: randomUUID(),
                    chat_Id: chat_Id,
                    role: "assistant",
                    content: JSON.stringify(error)
                }
            ])
        } finally {
            setLoading(false);
        }
    }


    return (
        <Box flexDirection='column' padding={1}>
            <Text bold color="greenBright">Navix Assistant</Text>

            <Box marginTop={1} flexDirection='column'>
                {messages.map((msg: Message) => {

                    const isUser =
                        msg.role === "user";

                    const isAssistant =
                        msg.role === "assistant";

                    const isThinking =
                        msg.role === "thinking";

                    return (

                        <Box
                            key={msg.message_Id}
                            marginBottom={1}
                            borderStyle="round"
                            borderColor={
                                isUser
                                    ? "cyan"
                                    : isThinking
                                        ? "yellow"
                                        : "green"
                            }
                            paddingX={1}
                        >

                            <Text>

                                <Text
                                    bold
                                    color={
                                        isUser
                                            ? "cyan"
                                            : isThinking
                                                ? "yellow"
                                                : "greenBright"
                                    }
                                >

                                    {
                                        isUser
                                            ? "You"
                                            : isThinking
                                                ? "Thinking"
                                                : "Navix"
                                    }

                                </Text>

                                : {msg.content}

                            </Text>

                        </Box>
                    );
                })}
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