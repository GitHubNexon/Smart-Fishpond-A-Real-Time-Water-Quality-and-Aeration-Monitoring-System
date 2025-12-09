'use client';

import React, { useEffect, useState } from 'react';
import useProfileFormLogic from './profile-form.logic';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckIcon, XIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AvatarUploader from '@/components/customs/avatar-uploader';
import { Skeleton } from '@/components/ui/skeleton';
import { OTPInput, SlotProps } from 'input-otp';
import { cn } from '@/lib/utils';

export default function ProfileForm({ profileData = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    handleSubmit,
    formData,
    setFormData,
    setConfirmPassword,
    confirmPassword,
    handleChange,
    handleUsernameChange,
    showPassword,
    togglePasswordVisibility,
    passwordStrength,
    passwordScore,
    getPasswordStrengthColor,
    getPasswordStrengthText,
    handleAvatarChange,
    handleCancel,
  } = useProfileFormLogic(profileData);

  if (!mounted || !profileData) {
    return (
      <Card className="w-full mx-auto shadow-lg border rounded-2xl p-4 space-y-4">
        <Skeleton className="h-10 w-32" /> {/* Card title */}
        <Skeleton className="h-24 w-full rounded-2xl" /> {/* Avatar */}
        <Skeleton className="h-10 w-full" /> {/* Full Name */}
        <Skeleton className="h-10 w-full" /> {/* Username */}
        <Skeleton className="h-10 w-full" /> {/* Password */}
        <Skeleton className="h-10 w-full" /> {/* Confirm Password */}
        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full mx-auto shadow-lg border rounded-2xl bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Avatar
            </label>
            <AvatarUploader
              value={formData.profileImage}
              onChange={handleAvatarChange}
              readOnly={false} // set true for view-only
              size={200}
            />
          </div>

          {/* Full Name */}
          <div className="grid gap-2">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          {/* Username */}
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleUsernameChange}
              placeholder="Choose a username"
            />
          </div>

          {/*  hide 2 factor  
          <div className="flex flex-col space-y-2">
            <Label className="mb-2" htmlFor="passKey">
              2FA Passkey
            </Label>

            <div className="flex items-center justify-center">
              <OTPInput
                id="passKey"
                value={formData.passKey}
                onChange={(val: string) =>
                  setFormData((prev) => ({ ...prev, passKey: val }))
                }
                containerClassName="flex items-center gap-3 justify-center"
                maxLength={6}
                render={({ slots }) => (
                  <div className="flex gap-3 w-full justify-center">
                    {slots.map((slot, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'h-12 w-12 flex items-center justify-center text-xl font-medium rounded-md border transition-all',
                          slot.isActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-background text-foreground',
                        )}
                      >
                        {slot.char ?? ''}
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">
              Update your 6-digit passkey for 2FA authentication.
            </p>
          </div>
          */}

          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a secure password"
                className="pe-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>

            {/* Password strength */}
            <div className="mt-2">
              <div className="bg-muted h-1 w-full rounded-full overflow-hidden">
                <div
                  className={`h-full ${getPasswordStrengthColor(
                    passwordScore,
                  )} transition-all duration-500`}
                  style={{ width: `${(passwordScore / 4) * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {getPasswordStrengthText(passwordScore)}. Must contain:
              </p>
              <ul className="mt-2 space-y-1.5">
                {passwordStrength.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {req.met ? (
                      <CheckIcon size={16} className="text-emerald-500" />
                    ) : (
                      <XIcon size={16} className="text-muted-foreground/70" />
                    )}
                    <span
                      className={`text-xs ${
                        req.met ? 'text-emerald-600' : 'text-muted-foreground'
                      }`}
                    >
                      {req.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
