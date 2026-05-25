export interface chats {
    chat_Id: string;
    chat_title: string;
}


export interface message {
    message_Id: string;
    chat_Id: string;
    user_message: string;
    ai_message: string;
}

