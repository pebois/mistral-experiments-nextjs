import { ChatMessageAssistantActions } from '@/components/chat/message/assistant/actions'
import { MarkDown } from '@/components/markdown'
import { Message, UseChatHelpers } from '@ai-sdk/react'
import React from 'react'

interface Props extends Message {
  chat: UseChatHelpers
}

export const ChatMessageAssistant: React.FC<Props> = ({ chat, ...message }) => {
  return (
    <div className="group w-full space-y-1">
      <div className="prose prose-zinc dark:prose-invert max-w-full">
        <MarkDown content={message.content} />
      </div>
      <div className="opacity-0 group-hover:opacity-100">
        <ChatMessageAssistantActions
          chat={chat}
          {...message} />
      </div>
    </div>
  )
}