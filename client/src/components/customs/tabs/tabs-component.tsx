import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';

interface TabItem {
  value: string;
  label: string;
  icon?: React.ElementType;
  component: React.ReactNode;
}

interface TabsComponentProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  loading?: boolean;
  onValueChange?: (value: string) => void;
}

export default function TabsComponent({
  items,
  value,
  defaultValue,
  loading = false,
  onValueChange,
}: TabsComponentProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <Tabs
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      className="flex flex-col items-start w-full"
      onValueChange={onValueChange}
    >
      <TabsList
        className="
          h-auto w-full flex justify-between 
          rounded-none border-b bg-transparent p-0 
          sm:justify-start sm:gap-2
        "
      >
        {items.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="
              relative flex flex-col items-center justify-center 
              flex-1 sm:flex-none sm:px-4 py-2 text-xs rounded-none 
              data-[state=active]:after:bg-primary 
              after:absolute after:inset-x-0 after:bottom-0 after:h-0.5
              data-[state=active]:bg-transparent data-[state=active]:shadow-none
              cursor-pointer
            "
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const currentPath = window.location.pathname;
                const newUrl = `${currentPath}?tab=${value}`;
                window.open(newUrl, '_blank');
              }
            }}

          >
            {Icon && (
              <Icon
                className="mb-0 sm:mb-1.5 opacity-70"
                size={18}
                aria-hidden="true"
              />
            )}
            {/* Hide label on mobile, show on sm+ */}
            <span className="hidden sm:inline">{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map(({ value, component }) => (
        <TabsContent key={value} value={value} className="w-full">
          <div className="flex w-full justify-center">
            <div className="w-full">{component}</div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
