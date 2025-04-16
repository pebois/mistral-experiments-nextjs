'use client'

import { Button } from '@/components/ui/button'
import { UseChatHelpers } from '@ai-sdk/react'
import React, { FormEvent, useCallback, useEffect, useRef } from 'react'

interface Props {
  allowEmptyMessage?: boolean
  chat: UseChatHelpers
  disabled?: boolean
}

export const ChatInput: React.FC<Props> = ({ allowEmptyMessage, chat, disabled }) => {
  const ref = useRef<HTMLTextAreaElement>(null!)
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const event = new Event('submit', { bubbles: true, cancelable: true })
      ref.current?.form?.dispatchEvent(event)
    }
  }, [])
  const handleInput = useCallback(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }, [])
  const handleSubmit = useCallback(async (e: FormEvent | MouseEvent) => {
    chat.handleSubmit(e, {
      allowEmptySubmit: allowEmptyMessage,
    })
    if (ref.current) {
      ref.current.style.height = 'auto'
    }
  }, [ chat, allowEmptyMessage ])
  useEffect(() => {
    const elt = ref.current
    elt?.addEventListener('keypress', handleKeyPress)
    elt?.addEventListener('input', handleInput)
    return () => {
      elt?.removeEventListener('keypress', handleKeyPress)
      elt?.removeEventListener('input', handleInput)
    }
  }, [ handleKeyPress, handleInput ])
  useEffect(() => {
    handleInput()
  }, [ chat.input, handleInput ])
  return (
    <form
      className="px-4"
      onSubmit={handleSubmit}>
      <div className="flex flex-col max-w-3xl m-auto p-4 space-y-4 items-end rounded-t-lg bg-sidebar border border-sidebar-border">
        <div className="flex flex-grow w-full">
          <textarea
            ref={ref}
            autoFocus
            autoComplete="off"
            className="flex-grow resize-none border-none focus:outline-none"
            disabled={disabled}
            placeholder="Messsage"
            rows={1}
            value={chat.input}
            onChange={chat.handleInputChange} />
        </div>
        <div>
          {(chat.status === 'streaming' || chat.status === 'submitted') ? (
            <Button onClick={chat.stop}>Stop</Button>
          ) : (<>
            <Button
              disabled={disabled}
              type="submit"
              onClick={handleSubmit}>Submit</Button>
          </>)}
        </div>
      </div>
    </form>
  )
}
