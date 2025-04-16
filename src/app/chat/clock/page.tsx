'use client'

import { Chat } from '@/components/chat'
import { useChat } from '@ai-sdk/react'

export default function Clock() {
  const chat = useChat({
    api: '/api/chat/clock',
    maxSteps: 2,
    onToolCall: async ({ toolCall }) => {
      switch (toolCall.toolName) {
      case 'get_user_timezone':
        return Intl.DateTimeFormat().resolvedOptions().timeZone
      default:
        return
      }
    },
  })
  return (
    <Chat chat={chat} />
  )
}
