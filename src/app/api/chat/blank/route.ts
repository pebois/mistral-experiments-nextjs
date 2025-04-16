import { mistral } from '@ai-sdk/mistral'
import { streamText } from 'ai'

export const maxDuration = 30

export async function POST (req: Request) {
  const { frequencyPenalty, messages, model, presencePenalty, system, temperature, topP } = await req.json()
  const result = streamText({
    model: mistral(model ?? 'mistral-large-latest'),
    system,
    messages,
    temperature,
    topP,
    presencePenalty,
    frequencyPenalty,
  })
  return result.toDataStreamResponse()
}
