//src/components/customs/form-tab.tsx

'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface TabItem {
  value: string;
  label: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
  };
  content?: React.ReactNode;
}

interface FormTabProps {
  tabs: TabItem[];
  defaultValue?: string;
  onTabChange?: (value: string) => void;
  className?: string;
}

export default function FormTab({
  tabs,
  defaultValue,
  onTabChange,
  className = '',
}: FormTabProps) {
  return (
    <Tabs
      defaultValue={defaultValue || tabs[0]?.value}
      onValueChange={onTabChange}
      className={className}
    >
      <ScrollArea>
        <TabsList className="mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent cursor-pointer"
              >
                <Icon
                  className="-ms-0.5 me-1.5 opacity-60 sm:me-1.5"
                  size={16}
                  aria-hidden="true"
                />
                {/* Hide text on small screens, show on larger screens */}
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge && (
                  <Badge
                    className={`ms-1.5 min-w-5 ${
                      tab.badge.variant === 'secondary'
                        ? 'bg-primary/15 px-1'
                        : ''
                    } ${tab.badge.className || ''}`}
                    variant={tab.badge.variant}
                  >
                    {tab.badge.text}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content || (
            <p className="pt-1 text-center text-xs text-muted-foreground">
              Content for {tab.label}
            </p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
