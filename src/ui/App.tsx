import React from 'react'
import { Chats } from './components/Chats.js'

export const App = (chat_Id: any) => {
    return (
        <Chats chat_Id={chat_Id} />
    )
}