'use client';

import { useState, useMemo, useEffect, useId } from 'react';
import { IoWarningOutline, IoRefreshOutline } from 'react-icons/io5';
import { UserFormData, UserPayload } from './user-form.interface';
import { createUser, updateUser } from '@/api/protected/user.api';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/configs/api.helper';
import { getChangedFields } from '@/utils/form-data.helper';
import {
  getUserPermissionsByUserId,
  createUserPermission,
  removeUserPermission,
  getAllPermissionList,
} from '@/api/protected/rbac.api';
import { getAllRouteValues } from '@/utils/route-constants';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { roleAccessMap } from './role-access.map';

export default function useFormModalLogic(
  open: boolean,
  close: () => void,
  mode: 'add' | 'edit' = 'add',
  initialData: UserFormData | null = null,
  onSuccess?: () => void,
) {
  const [confirmType, setConfirmType] = useState<'close' | 'reset' | null>(
    null,
  );
  const [formData, setFormData] = useState<UserFormData>({
    fullname: '',
    username: '',
    email: '',
    password: '',
    passKey: '',
    roleId: null,
    employeeId: null,
    access: [],
  });
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<any[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const id = useId();

  const defaultFormData: UserFormData = {
    fullname: '',
    username: '',
    email: '',
    password: '',
    passKey: '',
    roleId: null,
    employeeId: null,
    access: [],
  };

  useEffect(() => {
    async function fetchAllPermissions() {
      try {
        const res = await getAllPermissionList();
        setAllPermissions(res.data || []);
      } catch (e) {
        const message = extractErrorMessage(e);
        console.error('Failed to fetch permissions:', message);
      }
    }
    fetchAllPermissions();
  }, []);

  const getDefaultPermissions = () => {
    return allPermissions;
  };

  const getUserPermission = async () => {
    setLoading(true);
    try {
      const res = await getUserPermissionsByUserId(initialData?.id);
      if (res.data?.permissions && Array.isArray(res.data.permissions)) {
        setSelectedPermission(res.data.permissions);
        setOriginalPermissions(res.data.permissions);
      }
    } catch (e) {
      const message = extractErrorMessage(e);
      showToastError('Operation failed', message, 'bottom-right');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && mode === 'edit' && initialData?.id) {
      getUserPermission();
    }
    // Reset permissions when adding a new user
    if (open && mode === 'add' && allPermissions.length > 0) {
      const defaults = getDefaultPermissions();
      setSelectedPermission(defaults);
      setOriginalPermissions([]);
    }
  }, [open, mode, initialData?.id, allPermissions]);

  // Reset form data based on mode
  const handleReset = () => {
    if (mode === 'add') {
      // setFormData(defaultFormData);
      const roleKey = formData.roleId?.role?.toLowerCase() || 'student';
      const initialAccess = roleAccessMap[roleKey] || [];

      setFormData({
        ...defaultFormData,
        access: initialAccess,
      });

      setConfirmPassword('');
      const defaults = getDefaultPermissions();
      setSelectedPermission(defaults);
      setOriginalPermissions([]);
    } else if (mode === 'edit' && initialData) {
      const roleKey = initialData.roleId?.role?.toLowerCase() || 'student';
      const initialAccess =
        initialData.access?.filter((r) =>
          (roleAccessMap[roleKey] || []).includes(r),
        ) || [];
      setFormData({
        fullname: initialData.fullname || '',
        username: initialData.username || '',
        email: initialData.email || '',
        password: '',
        passKey: '',
        roleId: initialData.roleId || null,
        employeeId: initialData.employeeId || null,
        access: initialAccess,
      });
      setConfirmPassword('');
      getUserPermission();
    }
  };

  // Initialize or reset form when modal opens
  /** old
  useEffect(() => {
    if (open) {
      if (mode === 'add') {
        // setFormData(defaultFormData);
        setFormData({
          ...defaultFormData,
          access: getAllRouteValues(),
        });
        setConfirmPassword('');
        if (allPermissions.length > 0) {
          const defaults = getDefaultPermissions();
          setSelectedPermission(defaults);
          setOriginalPermissions([]);
        }
      } else if (mode === 'edit' && initialData) {
        setFormData({
          fullname: initialData.fullname || '',
          username: initialData.username || '',
          email: initialData.email || '',
          password: '',
          passKey: '',
          roleId: initialData.roleId || null,
          employeeId: initialData.employeeId || null,
          access: initialData.access || [],
        });
        setConfirmPassword('');
        getUserPermission();
      }
      setEmailError('');
    }
  }, [open, mode, initialData]);
  */

  useEffect(() => {
    if (open) {
      let initialAccess: string[] = [];
      if (mode === 'add') {
        const roleKey = formData.roleId?.role?.toLowerCase() || 'student';
        initialAccess = roleAccessMap[roleKey] || [];
        setFormData({
          ...defaultFormData,
          access: initialAccess,
        });
        setConfirmPassword('');
        if (allPermissions.length > 0) {
          setSelectedPermission(getDefaultPermissions());
          setOriginalPermissions([]);
        }
      } else if (mode === 'edit' && initialData) {
        const roleKey = initialData.roleId?.role?.toLowerCase() || 'student';
        initialAccess =
          initialData.access?.filter((r) =>
            (roleAccessMap[roleKey] || []).includes(r),
          ) || [];
        setFormData({
          fullname: initialData.fullname || '',
          username: initialData.username || '',
          email: initialData.email || '',
          password: '',
          passKey: '',
          roleId: initialData.roleId || null,
          employeeId: initialData.employeeId || null,
          access: initialAccess,
        });
        setConfirmPassword('');
        getUserPermission();
      }
      setEmailError('');
    }
  }, [open, mode, initialData, allPermissions]);

  // Dynamic dialog config now defined inside the hook
  const dialogConfig = {
    close: {
      title: 'Discard changes?',
      description:
        'Are you sure you want to close this form? Unsaved changes will be lost.',
      proceed: 'Yes, Close',
      cancel: 'Cancel',
      icon: <IoWarningOutline className="w-8 h-8 text-yellow-500" />,
      action: () => close(),
    },
    reset: {
      title: 'Reset form?',
      description:
        'Are you sure you want to reset the form? All input will be cleared.',
      proceed: 'Yes, Reset',
      cancel: 'Cancel',
      icon: <IoRefreshOutline className="w-8 h-8 text-blue-500" />,
      action: () => handleReset(),
    },
  };

  const currentDialog = confirmType ? dialogConfig[confirmType] : null;

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Confirm dialog controls
  const openConfirm = (type: 'close' | 'reset') => setConfirmType(type);
  const handleCancel = () => setConfirmType(null);
  const handleConfirm = () => {
    if (confirmType) {
      dialogConfig[confirmType].action();
    }
    setConfirmType(null);
  };

  const handlePasswordCheck = (): boolean => {
    if (confirmPassword !== formData.password) {
      showToastError(
        'Password not match',
        'Password does not match',
        'bottom-right',
      );
      setConfirmPassword('');
      return false;
    }

    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'Invalid email format');
    return isValid;
  };

  const handlePermissionChanges = async (userId: string) => {
    const selectedIds = selectedPermission.map((p) => p.id);
    const originalIds = originalPermissions.map((p) => p.id);

    // Find permissions to add (in selected but not in original)
    const permissionsToAdd = selectedIds.filter(
      (id) => !originalIds.includes(id),
    );

    // Find permissions to remove (in original but not in selected)
    const permissionsToRemove = originalIds.filter(
      (id) => !selectedIds.includes(id),
    );

    // Check if trying to remove "View" permission
    const viewPermission = originalPermissions.find(
      (p) => p.permission?.toLowerCase() === 'view',
    );

    if (viewPermission && permissionsToRemove.includes(viewPermission.id)) {
      throw new Error(
        'The "View" permission cannot be removed. It is required for all users.',
      );
    }

    // Add new permissions
    if (permissionsToAdd.length > 0) {
      try {
        await createUserPermission({
          userId: userId,
          permissionIds: permissionsToAdd as any,
        });
      } catch (error) {
        const message = extractErrorMessage(error);
        throw new Error(`Failed to add permissions: ${message}`);
      }
    }

    if (permissionsToRemove.length > 0) {
      try {
        await removeUserPermission(userId, {
          permissionIds: permissionsToRemove as any,
        });
      } catch (error) {
        const message = extractErrorMessage(error);
        throw new Error(`Failed to remove permissions: ${message}`);
      }
    }

    return {
      added: permissionsToAdd.length,
      removed: permissionsToRemove.length,
    };
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? '' : 'Invalid email format');
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('@')) value = '@' + value;
    setFormData((prev) => ({ ...prev, username: value }));
  };

  const validateData = (): boolean => {
    const requiredFields: { key: keyof UserFormData; label: string }[] = [
      { key: 'fullname', label: 'Full Name' },
      { key: 'username', label: 'Username' },
      { key: 'email', label: 'Email' },
      { key: 'roleId', label: 'Role' },
      // { key: 'employeeId', label: 'Employee' },
    ];

    if (mode === 'add') {
      requiredFields.push(
        { key: 'password', label: 'Password' },
        // { key: 'passKey', label: 'PassKey' },
      );
    }

    // Check empty required fields
    const missingFields = requiredFields.filter((f) => {
      const value = formData[f.key];
      if (f.key === 'roleId' || f.key === 'employeeId') {
        return !value; // Object must not be null
      }
      return !value || (value as string).trim() === '';
    });

    if (missingFields.length > 0) {
      const firstMissing = missingFields[0];
      showToastError(
        'Missing Field',
        `${firstMissing.label} is required.`,
        'bottom-right',
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!handlePasswordCheck()) return;
    if (!validateEmail(formData.email)) return;
    if (!validateData()) return;

    setLoading(true);

    try {
      let response;
      let userId: string;

      // Get the role key and allowed routes
      const roleKey = formData.roleId?.role?.toLowerCase() || 'student';
      const allowedRoutes = roleAccessMap[roleKey] || [];

      const filteredAccess = formData.access.filter((route) =>
        allowedRoutes.includes(route),
      );

      if (mode === 'add') {
        const { roleId, employeeId, ...rest } = formData;

        const payload: UserPayload = {
          ...rest,
          roleId: roleId?.id || null,
          employeeId: employeeId?.id || null,
          access: filteredAccess,
        };

        response = await createUser(payload);
        userId = response.data?.id;

        if (userId && selectedPermission.length > 0) {
          const permissionIds = selectedPermission.map((p) => p.id);
          try {
            await createUserPermission({
              userId: userId,
              permissionIds: permissionIds as any,
            });
          } catch (error) {
            const message = extractErrorMessage(error);
            showToastError(
              'User created but permissions failed',
              message,
              'bottom-right',
            );
          }
        }
      } else if (mode === 'edit' && initialData?.id) {
        userId = initialData.id;
        const { roleId, employeeId, ...rest } = formData;

        const rawUpdate = {
          ...rest,
          roleId: roleId?.id || null,
          employeeId: employeeId?.id || null,
          access: filteredAccess,
        };

        const updateData = getChangedFields<UserFormData, UserPayload>(
          initialData,
          rawUpdate,
          { skipEmpty: true },
        );

        const hasUserDataChanges = Object.keys(updateData).length > 0;
        const hasPermissionChanges =
          JSON.stringify(selectedPermission.map((p) => p.id).sort()) !==
          JSON.stringify(originalPermissions.map((p) => p.id).sort());

        if (!hasUserDataChanges && !hasPermissionChanges) {
          showToastSuccess(
            'No changes',
            `You didn't update anything.`,
            'top-center',
          );
          setLoading(false);
          return;
        }

        // Update user data if there are changes
        if (hasUserDataChanges) {
          response = await updateUser(userId, updateData);
        }

        // Handle permission changes
        if (hasPermissionChanges) {
          try {
            const changes = await handlePermissionChanges(userId);
            console.log(
              `Permissions updated: ${changes.added} added, ${changes.removed} removed`,
            );
          } catch (error) {
            const message = extractErrorMessage(error);
            showToastError('Permission update failed', message, 'bottom-right');
            setLoading(false);
            return;
          }
        }
      }

      showToastSuccess(
        mode === 'add' ? 'User Created' : 'User Updated',
        response?.message || 'Operation completed successfully',
        'top-right',
      );

      close();
      onSuccess?.();
      setError('');
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showToastError('Operation failed', message, 'bottom-right');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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

  return {
    confirmType,
    currentDialog,
    openConfirm,
    handleCancel,
    handleConfirm,
    handleSubmit,
    handleReset,
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
    selectedPermission,
    setSelectedPermission,
  };
}
