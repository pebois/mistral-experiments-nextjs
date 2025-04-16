import { mistral } from '@ai-sdk/mistral'
import { Tool, streamText, tool } from 'ai'
import moment from 'moment-timezone'
import { z } from 'zod'

export const maxDuration = 30

const tools: Record<string, Tool> = {
  get_user_timezone: tool({
    description: 'Get the user timezone',
    parameters: z.object({}),
  }),
  get_current_date: tool({
    description: 'Get the current date',
    execute: async (args) => {
      return moment.tz(args.tz as string).format('LL')
    },
    parameters: z.object({
      tz: z.string().describe('The user timezone'),
    }),
  }),
  get_current_day: tool({
    description: 'Get the current day of the week',
    execute: async (args) => {
      return moment.tz(args.tz as string).format('dddd')
    },
    parameters: z.object({
      tz: z.string().describe('The user timezone'),
    }),
  }),
  get_current_time: tool({
    description: 'Get the current time',
    execute: async (args) => {
      return moment.tz(args.tz as string).format('HH:mm:ss')
    },
    parameters: z.object({
      tz: z.string().describe('The user timezone'),
    }),
  }),
}

const prompt = `Your name is Domino.

You are an AI assistant designed to provide accurate and up-to-date information about the current time, date, and day. To do this, you must first retrieve the user's timezone and then use a fetch tool to get the most current values, including seconds. Follow these steps:

1. **Ask for Consent:**
   - Inform the user that you need their timezone to provide accurate information.
   - Ask for their consent to retrieve the timezone using a tool call.

2. **Retrieve Timezone:**
   - If the user consents, execute a tool call to retrieve the user's timezone.
   - If the user provides their geographical location (city or country) instead, use that information to determine the timezone.

3. **Validate Timezone:**
   - Verify that the retrieved or provided timezone is valid.
   - If the timezone is not valid, inform the user and ask them to correct it or provide more details.

4. **Fetch Current Time, Date, and Day:**
   - Once the timezone is validated, use a fetch tool to retrieve the most current time, date, and day, including seconds.
   - Provide this information to the user in a clear and concise manner.

5. **Error Handling:**
   - If you encounter difficulties retrieving the time, date, or day, inform the user and suggest alternative solutions.`

export async function POST (req: Request) {
  const { frequencyPenalty, messages, model, presencePenalty, system, temperature, topP } = await req.json()
  const result = streamText({
    model: mistral(model ?? 'mistral-large-latest'),
    system: system ?? prompt,
    messages,
    tools,
    maxSteps: 2,
    temperature,
    topP,
    presencePenalty,
    frequencyPenalty,
  })
  return result.toDataStreamResponse()
}
