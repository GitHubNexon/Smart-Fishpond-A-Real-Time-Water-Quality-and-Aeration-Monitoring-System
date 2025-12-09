'use client';
import React from 'react';
import DrawerComponent from '@/components/customs/drawer.component';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Mail, Calendar, Hash, AlertCircle } from 'lucide-react';
import { formatDate } from '@syntaxsentinel/date-utils';
import { User as UserType } from './users-table.logic';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { routesByCategory } from '@/utils/route-constants';
import { ListRestart } from 'lucide-react';

interface UserDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
}

export default function UserDetails({
  open,
  onOpenChange,
  user,
}: UserDetailsProps) {
  if (!user) return null;

  const initials = user.fullname
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const isAdmin = user.roleId.role.toLowerCase() === 'administrator';
  const isLocked =
    user.lockoutUntil && new Date(user.lockoutUntil) > new Date();
  const isDeleted = !!user.deletedAt;

  return (
    <DrawerComponent
      open={open}
      onOpenChange={onOpenChange}
      title="User Details"
      description="View complete user information"
      direction="left"
    >
      <div className="space-y-6 py-4">
        {/* User Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Avatar className="h-24 w-24">
            {user.profileImage ? (
              <AvatarImage src={user.profileImage} alt={user.fullname} />
            ) : (
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="text-2xl font-bold">{user.fullname}</h3>
            <p className="text-muted-foreground">{user.username}</p>
          </div>
        </div>

        <Separator />

        {/* Account Status */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Account Status
          </h4>
          <div className="space-y-2">
            {isDeleted ? (
              <Badge
                variant="destructive"
                className="w-full justify-center py-2"
              >
                Deactivated on {formatDate.readableDateTime(user.deletedAt)}
              </Badge>
            ) : isLocked ? (
              <Badge
                variant="destructive"
                className="w-full justify-center py-2"
              >
                Locked until {formatDate.readableDateTime(user.lockoutUntil!)}
              </Badge>
            ) : (
              <Badge variant="outline" className="w-full justify-center py-2">
                Active
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Information
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-md">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Role & Permissions */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Role & Permissions
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-md">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge
                variant={isAdmin ? 'default' : 'secondary'}
                className="gap-1"
              >
                {isAdmin ? (
                  <Shield className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                {user.roleId.role}
              </Badge>
            </div>

            {user.roleId.description && (
              <div className="py-2 px-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground mb-1">
                  Role Description
                </p>
                <p className="text-sm">{user.roleId.description}</p>
              </div>
            )}

            {user.userPermissions && user.userPermissions.length > 0 && (
              <div className="py-2 px-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground mb-2">
                  Permissions
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.userPermissions.map((perm, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {perm.permission?.permission || 'Unknown'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* System Access */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <ListRestart className="h-4 w-4" />
            System Access
          </h4>

          {user.access && user.access.length > 0 ? (
            <ScrollArea className="h-48 rounded-md border p-4">
              <div className="space-y-4">
                {Object.entries(routesByCategory).map(([category, routes]) => {
                  // Filter routes based on user.access
                  const accessible = routes.filter((r) =>
                    user.access.includes(r.value),
                  );
                  if (accessible.length === 0) return null;

                  return (
                    <div key={category}>
                      <h5 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                        {category}
                      </h5>
                      <ul className="space-y-1 pl-2">
                        {accessible.map((route) => (
                          <li
                            key={route.value}
                            className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-muted transition"
                          >
                            <span className="text-sm">{route.label}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {route.value}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No access routes assigned.
            </p>
          )}
        </div>

        {/* Security Information */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Security Information
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-md">
              <span className="text-sm text-muted-foreground">
                Failed Login Attempts
              </span>
              <Badge
                variant={user.failedAttempts > 0 ? 'destructive' : 'outline'}
              >
                {user.failedAttempts}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Metadata */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-md">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm">
                {formatDate.readableDateTime(user.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-md">
              <span className="text-sm text-muted-foreground">
                Last Updated
              </span>
              <span className="text-sm">
                {formatDate.readableDateTime(user.updatedAt)}
              </span>
            </div>
            {user.deletedAt && (
              <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-md">
                <span className="text-sm text-muted-foreground">Deleted</span>
                <span className="text-sm">
                  {formatDate.readableDateTime(user.deletedAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* System Information */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Hash className="h-4 w-4" />
            System Information
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-md">
              <span className="text-sm text-muted-foreground">User ID</span>
              <span className="text-xs font-mono">{user.id}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-muted rounded-md">
              <span className="text-sm text-muted-foreground">Version</span>
              <Badge variant="outline">{user.version}</Badge>
            </div>
          </div>
        </div>
      </div>
    </DrawerComponent>
  );
}
