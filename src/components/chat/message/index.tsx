import { ChatMessageAssistant } from '@/components/chat/message/assistant'
import { ChatMessageToolInvocation } from '@/components/chat/message/tool/invocation'
import { ChatMessageUser } from '@/components/chat/message/user'
import { Message, UseChatHelpers } from '@ai-sdk/react'
import { ToolInvocation } from '@ai-sdk/ui-utils'
import React, { useMemo } from 'react'

interface Props extends Message {
  chat: UseChatHelpers
}

export const ChatMessage: React.FC<Props> = ({ chat, ...message }) => {
  const invocations = useMemo(() => {
    const tmp: ToolInvocation[] = []
    for (const part of message.parts ?? []) {
      if (part.type === 'tool-invocation') {
        tmp.push(part.toolInvocation)
      }
    }
    return tmp
  }, [ message ])
  return (
    <div className="space-y-2">
      {invocations.map((invocation) => (
        <ChatMessageToolInvocation
          key={invocation.toolCallId}
          {...invocation} />
      ))}
      {(message.content) && (
        <div className="flex justify-end">
          {(message.role === 'user') ? (
            <ChatMessageUser
              chat={chat}
              {...message} />
          ) : (
            <ChatMessageAssistant
              chat={chat}
              {...message} />
          )}
        </div>
      )}
    </div>
  )
}