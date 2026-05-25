export interface Chat {
    chat_Id: string;
    chat_title: string;
}

export interface Message {
    message_Id: string;
    chat_Id: string;
    role: 'user' | 'assistant';
    content: string;
}