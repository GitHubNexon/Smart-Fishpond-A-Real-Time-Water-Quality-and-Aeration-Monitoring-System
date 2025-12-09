// src/(private)/employee/[employeeId]/tabs/work-info-tab.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Briefcase, Building, CheckCircle } from 'lucide-react';
import { formatDate } from '@syntaxsentinel/date-utils';
import { formatNumber } from '@/utils/format-number.util';
import { EmployeeWorkExperienceInfo } from '@/api/protected/employee-api/employee.interface';
import { JobDetailsData } from '@/api/protected/job-details-api/employee-job-details.interface';
import { InfoField } from '../components/info-field';

interface WorkInfoTabProps {
  workExperienceInfo?: EmployeeWorkExperienceInfo[];
  coreWorkInfo?: JobDetailsData[];
}

export default function WorkInfoTab({
  workExperienceInfo,
  coreWorkInfo,
}: WorkInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Work Experience & Employment History
        </CardTitle>
        <CardDescription>
          Previous employment and current job details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Previous Work Experience */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Previous Work Experience
          </h3>
          {workExperienceInfo && workExperienceInfo.length > 0 ? (
            <div className="space-y-4">
              {workExperienceInfo.map((work, index) => (
                <Card key={work.id || index} className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {work.position || 'N/A'}
                        </h4>
                        <p className="text-muted-foreground">
                          {work.companyName || 'N/A'}
                        </p>
                      </div>
                      {work.employmentType && (
                        <Badge variant="outline">{work.employmentType}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">From Date</p>
                        <p className="font-medium">
                          {work.fromDate
                            ? formatDate.shortDate(work.fromDate)
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">To Date</p>
                        <p className="font-medium">
                          {work.toDate
                            ? formatDate.shortDate(work.toDate)
                            : 'Present'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Salary</p>
                        <p className="font-medium">
                          {work.salary
                            ? formatNumber(work.salary, {
                                type: 'currency',
                                currency: 'PHP',
                                locale: 'en-PH',
                              })
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No previous work experience available
            </p>
          )}
        </div>

        <Separator />

        {/* Hitory Employment Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Employment Details History
          </h3>

          {coreWorkInfo && coreWorkInfo.length > 0 ? (
            <div className="space-y-4">
              {coreWorkInfo.map((job: JobDetailsData, index) => (
                <Card key={job.id || index} className="border-2">
                  <CardContent className="p-6">
                    {/* Header: Position, Department, Badges */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-xl">
                          {job.position ?? 'N/A'}
                        </h4>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {job.department ?? 'N/A'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        {job.employmentStatus && (
                          <Badge
                            variant={
                              job.employmentStatus === 'Active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {job.employmentStatus}
                          </Badge>
                        )}
                        {job.employmentType && (
                          <Badge variant="outline">{job.employmentType}</Badge>
                        )}
                        {job.isVerified && (
                          <Badge
                            variant="default"
                            className="bg-green-600 flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Dates and Employment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <InfoField
                        label="Date Hired"
                        value={
                          job.dateHired
                            ? formatDate.shortDate(job.dateHired)
                            : null
                        }
                        compact
                      />
                      <InfoField
                        label="Date Regularized"
                        value={
                          job.dateRegularized
                            ? formatDate.shortDate(job.dateRegularized)
                            : null
                        }
                        compact
                      />
                      <InfoField
                        label="Probation End"
                        value={
                          job.probationPeriodEnd
                            ? formatDate.shortDate(job.probationPeriodEnd)
                            : null
                        }
                        compact
                      />
                      <InfoField
                        label="Contract Start"
                        value={
                          job.contractStartDate
                            ? formatDate.shortDate(job.contractStartDate)
                            : null
                        }
                        compact
                      />
                      <InfoField
                        label="Contract End"
                        value={
                          job.contractEndDate
                            ? formatDate.shortDate(job.contractEndDate)
                            : null
                        }
                        compact
                      />

                      {job.resignedDate && (
                        <>
                          <InfoField
                            label="Resigned Date"
                            value={formatDate.shortDate(job.resignedDate)}
                            compact
                          />
                          <InfoField
                            label="Resignation Reason"
                            value={job.resignationReason ?? 'N/A'}
                            compact
                          />
                        </>
                      )}

                      {job.terminatedDate && (
                        <>
                          <InfoField
                            label="Terminated Date"
                            value={formatDate.shortDate(job.terminatedDate)}
                            compact
                          />
                          <InfoField
                            label="Termination Reason"
                            value={job.terminationReason ?? 'N/A'}
                            compact
                          />
                        </>
                      )}

                      {job.retiredDate && (
                        <InfoField
                          label="Retired Date"
                          value={formatDate.shortDate(job.retiredDate)}
                          compact
                        />
                      )}
                    </div>

                    {/* Notes */}
                    {(job.resignationNotes ||
                      job.terminationNotes ||
                      job.retirementNotes) && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Notes
                          </p>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg">
                            {job.resignationNotes ??
                              job.terminationNotes ??
                              job.retirementNotes}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Footer: Created, Updated, Prepared By */}
                    <Separator className="my-4" />
                    <div className="flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
                      {job.createdAt && (
                        <div>
                          <span className="font-medium">Created: </span>
                          {formatDate.readableDateTime(job.createdAt)}
                        </div>
                      )}
                      {job.updatedAt && (
                        <div>
                          <span className="font-medium">Last Updated: </span>
                          {formatDate.readableDateTime(job.updatedAt)}
                        </div>
                      )}
                      {job.preparedBy?.fullname && (
                        <div>
                          <span className="font-medium">Prepared by: </span>
                          {job.preparedBy.fullname}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No employment details available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
