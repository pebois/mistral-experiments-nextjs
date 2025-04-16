'use client'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { FileIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const data = [
  {
    title: 'Blank',
    url: '/chat/blank',
    icon: FileIcon,
  },
  {
    title: 'Clock',
    url: '/chat/clock',
    icon: FileIcon,
  },
  {
    title: 'Memory',
    url: '/chat/memory',
    icon: FileIcon,
  },
]

export const MainNavigation: React.FC = () => {
  const pathname = usePathname()
  return (
    <SidebarMenu>
      {data.map((item) => (
        <SidebarMenuItem key={item.title}>
          <Link href={item.url}>
            <SidebarMenuButton
              className="cursor-pointer"
              isActive={pathname === item.url}
              tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}