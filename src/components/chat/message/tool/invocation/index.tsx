'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ToolInvocation } from '@ai-sdk/ui-utils'
import { ChevronsUpDown } from 'lucide-react'
import React from 'react'

export const ChatMessageToolInvocation: React.FC<ToolInvocation> = (invocation) => {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <Collapsible
      className="space-y-2"
      open={isOpen}
      onOpenChange={setIsOpen}>
      <div className="flex items-center space-x-1">
        <CollapsibleTrigger asChild>
          <Button
            size="sm"
            variant="ghost">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
            <h4 className="text-sm font-semibold">{invocation.toolName}</h4>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <Card className="shadow-none">
          <CardContent>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify({
                ...invocation,
                state: undefined,
                step: undefined,
                toolCallId: undefined,
                toolName: undefined,
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
