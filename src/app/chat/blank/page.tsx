'use client'

import { Chat } from '@/components/chat'
import { useChat } from '@ai-sdk/react'

export default function Blank() {
  const chat = useChat({
    api: '/api/chat/blank',
  })
  return (
    <Chat chat={chat} />
  )
}
