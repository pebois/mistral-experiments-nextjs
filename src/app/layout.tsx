import { MainNavigation } from '@/components/main/navigation'
import { ThemeProvider } from '@/components/theme/provider'
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

import './globals.css'

export const metadata: Metadata = {
  title: 'Mistral AI Experiments',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      suppressHydrationWarning
      lang="en">
      <body>
        <SidebarProvider>
          <ThemeProvider
            disableTransitionOnChange
            enableSystem
            attribute="class"
            defaultTheme="system">
            <div className="h-dvh w-dvw">
              <div className="flex h-full flex-row items-center justify-center">
                <div className="relative flex h-full w-full justify-start overflow-hidden">
                  <div className="flex min-h-svh w-full">
                    <Sidebar>
                      <SidebarHeader>
                        <div className="space-x-1.5 text-center">
                          <span className="text-xl font-extrabold">Mistral AI</span>
                          <span className="text-lg">Experiments</span>
                        </div>
                      </SidebarHeader>
                      <SidebarContent>
                        <SidebarGroup>
                          <MainNavigation />
                        </SidebarGroup>
                      </SidebarContent>
                    </Sidebar>
                    <div className="w-full h-full">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  )
}
