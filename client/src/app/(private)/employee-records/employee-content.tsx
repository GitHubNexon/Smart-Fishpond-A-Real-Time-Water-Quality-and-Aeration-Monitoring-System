'use client';

import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  FileText,
  LucideIcon,
  User,
  Briefcase,
  Layers,
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmployeeTable from './components/employee-core-records/employee-table';
import EmployeeJobDetailsTable from './components/employee-job-details/employee-job-details-table';

interface EmployeeRecordsTab {
  value: string;
  label: string;
  icon: LucideIcon;
  content: React.FC;
}


const OverviewContent: React.FC = () => {
  // Dummy data for the 4 cards with icons
  const stats = [
    { title: 'Total Employees', value: 120, icon: User },
    { title: 'Departments', value: 8, icon: Briefcase },
    { title: 'Active Projects', value: 15, icon: Layers },
    { title: 'Awards Received', value: 27, icon: Award },
  ];

  return (
    <div className="p-4 pt-1 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Employee Overview</h2>
      <p className="text-sm text-muted-foreground">
        This section provides a summary of all employee records, including
        personal details, department, and current position.
      </p>
      <p className="text-sm text-muted-foreground">DUMMY DATA</p>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="p-4 bg-card rounded-lg shadow hover:shadow-md transition cursor-pointer flex items-center gap-3"
            >
              <div className="p-2 bg-primary text-primary-foreground rounded-full">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Employee Table */}
      <div className="mt-6">
        <EmployeeTable />
      </div>
    </div>
  );
};

const JobDetailsContent: React.FC = () => (
  <div className="p-4 pt-1">
    <h2 className="text-lg font-semibold mb-2">Job History</h2>
    <p className="text-sm text-muted-foreground">
      View the past roles, and departments each employee has worked
      in.
    </p>
    {/* You can replace the below with a real JobHistoryTable component */}
    <div className="mt-6">
      <EmployeeJobDetailsTable />
    </div>
  </div>
);

const AchievementsContent: React.FC = () => (
  <div className="p-4 pt-1">
    <h2 className="text-lg font-semibold mb-2">Achievements</h2>
    <p className="text-sm text-muted-foreground">
      Highlight employee accomplishments, awards, and recognitions.
    </p>
  </div>
);

const DocumentsContent: React.FC = () => (
  <div className="p-4 pt-1">
    <h2 className="text-lg font-semibold mb-2">Documents</h2>
    <p className="text-sm text-muted-foreground">
      Include contracts, certifications, and other HR-related documents.
    </p>
  </div>
);

const TABS: EmployeeRecordsTab[] = [
  {
    value: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    content: OverviewContent,
  },
  {
    value: 'job-details',
    label: 'Employee Job Details',
    icon: GraduationCap,
    content: JobDetailsContent,
  },
  {
    value: 'achievements',
    label: 'Achievements',
    icon: Award,
    content: AchievementsContent,
  },
  {
    value: 'documents',
    label: 'Documents',
    icon: FileText,
    content: DocumentsContent,
  },
];

export default function EmployeeRecordsContent() {
  return (
    <Tabs defaultValue={TABS[0].value}>
      <ScrollArea>
        <TabsList className="mb-3 gap-1 bg-transparent">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none cursor-pointer"
              >
                <Icon className="-ms-0.5 me-1.5 opacity-60" size={16} />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {TABS.map((tab) => {
        const ContentComponent = tab.content;
        return (
          <TabsContent key={tab.value} value={tab.value}>
            <ContentComponent />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
