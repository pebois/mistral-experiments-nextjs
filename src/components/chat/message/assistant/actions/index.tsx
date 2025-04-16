import { useCopyToClipboard } from '@/hooks/use-clipboard'
import { Message, UseChatHelpers } from 'ai/react'
import { ClipboardIcon, RefreshCwIcon } from 'lucide-react'
import React, { useMemo } from 'react'
import { toast } from 'sonner'

interface Props extends Message {
  chat: UseChatHelpers
}

export const ChatMessageAssistantActions: React.FC<Props> = ({ chat, ...message }) => {
  const { copy } = useCopyToClipboard()
  const isLast = useMemo(() => (
    message.id === chat.messages[chat.messages.length - 1]?.id
  ), [chat.messages, message.id])
  return (
    <div className="flex justify-end space-x-2">
      <button
        onClick={() => {
          toast('Copied!')
          copy(message.content)
        }}>
        <ClipboardIcon
          height={18}
          width={18} />
      </button>
      {(isLast) && (
        <button onClick={() => chat.reload()}>
          <RefreshCwIcon
            height={18}
            width={18} />
        </button>
      )}
    </div>
  )
}
