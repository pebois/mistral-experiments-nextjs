import { Card, CardContent } from '@/components/ui/card'
import { Message, UseChatHelpers } from '@ai-sdk/react'
import React from 'react'

interface Props extends Message {
  chat: UseChatHelpers
}

export const ChatMessageUser: React.FC<Props> = ({ chat, ...message }) => {
  return (
    <div className="max-w-[80%] flex justify-end">
      <Card className="shadow-none">
        <CardContent>
          {message.content.trim()}
        </CardContent>
      </Card>
    </div>
  )
}