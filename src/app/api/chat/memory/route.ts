import { mistral } from '@ai-sdk/mistral'
import { streamText, Tool, tool } from 'ai'
import { z } from 'zod'

export const maxDuration = 30

const tools: Record<string, Tool> = {
  create_entities: tool({
    description: 'Create multiple new entities in the knowledge graph',
    parameters: z.object({
      entities: z.array(
        z.object({
          name: z.string().describe('Entity identifier'),
          type: z.string().describe('Type classification'),
          observations: z.array(z.string()).describe('Associated observations'),
        }),
      ),
    }),
  }),
  create_relations: tool({
    description: 'Create multiple new relations between entities',
    parameters: z.object({
      relations: z.array(
        z.object({
          from: z.string().describe('Source entity name'),
          to: z.string().describe('Target entity name'),
          type: z.string().describe('Relationship type in active voice'),
        }),
      ),
    }),
  }),
  add_observations: tool({
    description: 'Add new observations to existing entities',
    parameters: z.object({
      observations: z.array(
        z.object({
          entity_name: z.string().describe('Target entity'),
          contents: z.array(z.string()).describe('New observations to add'),
        }),
      ),
    }),
  }),
  delete_entities: tool({
    description: 'Remove entities and their relations',
    parameters: z.object({
      entities: z.array(z.string()).describe('Array of entity names to remove'),
    }),
  }),
  delete_observations: tool({
    description: 'Remove specific observations from entities',
    parameters: z.object({
      deletions: z.array(
        z.object({
          entity_name: z.string().describe('Target entity'),
          contents: z.array(z.string()).describe('Observations to remove'),
        }),
      ),
    }),
  }),
  delete_relations: tool({
    description: 'Remove specific relations from the graph',
    parameters: z.object({
      relations: z.array(
        z.object({
          from: z.string().describe('Source entity name'),
          to: z.string().describe('Target entity name'),
          type: z.string().describe('Relationship type'),
        }),
      ),
    }),
  }),
  read_graph: tool({
    description: 'Read the entire knowledge graph',
    parameters: z.object({}),
  }),
  search_nodes: tool({
    description: 'Search for nodes based on query',
    parameters: z.object({
      query: z.string().describe('Search query'),
    }),
  }),
  open_nodes: tool({
    description: 'Retrieve specific nodes by name',
    parameters: z.object({
      names: z.array(z.string()).describe('Names of nodes to retrieve'),
    }),
  }),
}

const prompt = `Your name is Domino.

You have acces to a knowledge graph.

Follow these steps for each interaction:

1. User Identification:
  - You should assume that you are interacting with default_user
  - If you have not identified default_user, proactively try to do so.

2. Memory Retrieval:
  - Always begin your chat by retrieving all relevant information from your knowledge graph
  - Always refer to your knowledge graph as your "memory"

3. Memory
  - While conversing with the user, be attentive to any new information that falls into these categories:
    a) Basic Identity (age, gender, location, job title, education level, etc.)
    b) Behaviors (interests, habits, etc.)
    c) Preferences (communication style, preferred language, etc.)
    d) Goals (goals, targets, aspirations, etc.)
    e) Relationships (personal and professional relationships up to 3 degrees of separation)
  - When referring to individuals or entities:
    a) Use their primary identifier only.
    b) Avoid using alternative names or nicknames unless specifically requested by the user.
    c) Ensure that the context around the name provides sufficient clarity to avoid misunderstandings.

4. Memory Update:
  - If any new information was gathered during the interaction, update your memory as follows:
    a) Create entities for recurring organizations, people, and significant events
    b) Connect them to the current entities using relations
    b) Store facts about them as observations`

export async function POST (req: Request) {
  const { frequencyPenalty, messages, model, presencePenalty, system, temperature, topP } = await req.json()
  const result = streamText({
    model: mistral(model ?? 'mistral-large-latest'),
    system: system ?? prompt,
    messages,
    tools,
    maxSteps: 15,
    temperature,
    topP,
    presencePenalty,
    frequencyPenalty,
  })
  return result.toDataStreamResponse()
}
