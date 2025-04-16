import { ChatAnchor } from '@/components/chat/anchor'
import { ChatMessage } from '@/components/chat/message'
import { UseChatHelpers } from '@ai-sdk/react'
import { useCallback, useRef } from 'react'

interface Props {
  chat: UseChatHelpers
}

export const ChatHistory: React.FC<Props> = ({ chat }: Props) => {
  const root = useRef<HTMLDivElement>(null!)
  const handleScroll = useCallback((inView: boolean) => {
    if (!inView && chat.status === 'streaming') {
      root.current.scroll({
        behavior: 'instant',
        top: root.current.scrollHeight,
      })
    }
  }, [ chat ])
  return (
    <div
      ref={root}
      className="flex h-full w-full overflow-auto">
      <div className="max-w-3xl m-auto h-full w-full">
        <div className="flex flex-col p-4 space-y-4 pb-4">
          {chat.messages.map((message) => (
            <ChatMessage
              key={message.id}
              chat={chat}
              {...message} />
          ))}
        </div>
        <ChatAnchor
          root={root.current}
          onInViewChange={handleScroll} />
      </div>
    </div>
  )
}