'use client'

import { ChatHistory } from '@/components/chat/history'
import { ChatInput } from '@/components/chat/input'
import { UseChatHelpers } from '@ai-sdk/react'
import React from 'react'

interface Props {
  allowEmptyMessage?: boolean
  chat: UseChatHelpers
  disabled?: boolean
}

export const Chat: React.FC<Props> = ({ allowEmptyMessage, chat, disabled }) => {
  return (
    <div className="flex flex-col w-full h-full justify-center">
      <ChatHistory chat={chat} />
      <ChatInput
        allowEmptyMessage={allowEmptyMessage}
        chat={chat}
        disabled={disabled} />
    </div>
  )
}