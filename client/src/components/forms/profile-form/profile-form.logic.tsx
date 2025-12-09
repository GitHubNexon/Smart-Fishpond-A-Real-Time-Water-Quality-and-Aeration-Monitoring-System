'use client';

import { useState, useMemo, useEffect } from 'react';
import { IoWarningOutline, IoRefreshOutline } from 'react-icons/io5';
import { UserProfileFormData } from '@/modals/user-form-modals/user-form.interface';
import { toast } from '@/components/ui/sonner';
import { createUser, updateUser } from '@/api/protected/user.api';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/configs/api.helper';
import { getChangedFields } from '@/utils/form-data.helper';
import { showToastSuccess, showToastError } from '@/utils/toast-config';

export default function useProfileFormLogic(
  profileData: UserProfileFormData | null = null,
) {
  const [formData, setFormData] = useState<UserProfileFormData>({
    fullname: '',
    username: '',
    password: '',
    passKey: '',
    profileImage: '',
  });
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const defaultFormData: UserProfileFormData = {
    fullname: '',
    username: '',
    password: '',
    passKey: '',
    profileImage: '',
  };

  useEffect(() => {
    if (profileData) {
      setFormData({
        fullname: profileData.fullname || '',
        username: profileData.username || '',
        password: '',
        passKey: '',
        profileImage: profileData.profileImage || '',
      });
      setConfirmPassword('');
      setEmailError('');
    }
  }, [profileData]);

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handlePasswordCheck = (): boolean => {
    if (confirmPassword !== formData.password) {
      toast.error({
        title: 'Password not match',
        description: 'Password does not match',
      });

      setConfirmPassword('');
      return false;
    }

    return true;
  };

  // Password strength logic
  const checkPasswordStrength = (password: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[0-9]/, text: 'At least 1 number' },
      { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
      { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    ];
    return requirements.map((req) => ({
      met: req.regex.test(password),
      text: req.text,
    }));
  };

  const passwordStrength = useMemo(
    () => checkPasswordStrength(formData.password),
    [formData.password],
  );
  const passwordScore = passwordStrength.filter((req) => req.met).length;

  const getPasswordStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border';
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score === 0) return 'Enter a password';
    if (score <= 2) return 'Weak password';
    if (score === 3) return 'Medium password';
    return 'Strong password';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('@')) value = '@' + value;
    setFormData((prev) => ({ ...prev, username: value }));
  };

  // Inside useProfileFormLogic
  const handleAvatarChange = (file: File | null, base64?: string) => {
    setFormData((prev) => {
      const newValue = base64 || '';
      // if (prev.profileImage === newValue) return prev;
      return { ...prev, profileImage: newValue };
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!handlePasswordCheck()) return;

    setLoading(true);

    try {
      if (!profileData?.id) {
        throw new Error('No user ID found for update.');
      }

      const rawUpdate = { ...formData };
      if (!rawUpdate.password) delete rawUpdate.password;

      const updateData = getChangedFields<
        UserProfileFormData,
        typeof rawUpdate
      >(profileData, rawUpdate, { skipEmpty: false });

      if (Object.keys(updateData).length === 0) {
        showToastSuccess(
          'You didn’t update anything.',
          'No changes',
          'top-center',
        );
        setLoading(false);
        return;
      }

      const response = await updateUser(profileData.id, updateData);

      router.replace('/profile');
      showToastSuccess('Profile Updated', response.message, 'top-right');
      setError('');
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showToastError('Update', 'failed', 'bottom-right');
      console.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    formData,
    setFormData,
    confirmPassword,
    setConfirmPassword,
    emailError,
    setEmailError,
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
  };
}
