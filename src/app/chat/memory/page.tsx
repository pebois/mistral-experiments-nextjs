'use client'

import { Entity, Observation, Relation, useMemoryStore } from '@/app/chat/memory/store'
import { Chat } from '@/components/chat'
import { useChat } from '@ai-sdk/react'
import { useEffect } from 'react'

export default function Blank() {
  const { connect, connected, ...actions } = useMemoryStore()
  const chat = useChat({
    api: '/api/chat/memory',
    maxSteps: 15,
    onToolCall: async ({ toolCall }) => {
      switch (toolCall.toolName) {
      case 'get_user_timezone':
        return Intl.DateTimeFormat().resolvedOptions().timeZone
      case 'create_entities':
        await actions.create_entities(toolCall.args as { entities: Entity[] })
        return 'done'
      case 'create_relations':
        await actions.create_relations(toolCall.args as { relations: Relation[] })
        return 'done'
      case 'add_observations':
        await actions.add_observations(toolCall.args as { observations: Observation[] })
        return 'done'
      case 'delete_entities':
        await actions.delete_entities(toolCall.args as { entities: string[] })
        return 'done'
      case 'delete_observations':
        await actions.delete_observations(toolCall.args as { observations: Observation[] })
        return 'done'
      case 'delete_relations':
        await actions.delete_relations(toolCall.args as { relations: Relation[] })
        return 'done'
      case 'read_graph':
        return await actions.read_graph()
      case 'search_nodes':
        return await actions.search_nodes(toolCall.args as { query: string })
      case 'open_nodes':
        return await actions.open_nodes(toolCall.args as { names: string[] })
      default:
        return
      }
    },
  })
  useEffect(() => {
    connect()
  }, [ connect ])
  return (
    <Chat
      chat={chat}
      disabled={!connected} />
  )
}
