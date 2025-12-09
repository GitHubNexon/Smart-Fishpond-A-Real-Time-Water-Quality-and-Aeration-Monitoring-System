// src/utils/toast-config.ts
import { toast, ToastPosition } from '@/components/ui/sonner';

type ToastType = 'success' | 'error';

interface ToastOptions {
  title: string;
  description?: string;
  position?: ToastPosition; // optional position
}

export const showToast = (type: ToastType, options: ToastOptions) => {
  const position = options.position ?? 'top-right'; // default position

  if (type === 'success') {
    toast.success({
      title: options.title,
      description: options.description,
      position,
    });
  } else if (type === 'error') {
    toast.error({
      title: options.title,
      description: options.description,
      position,
    });
  }
};

// Helpers for common cases
export const showToastSuccess = (
  title: string,
  description?: string,
  position?: ToastPosition,
) => showToast('success', { title, description, position });

export const showToastError = (
  title: string,
  description?: string,
  position?: ToastPosition,
) => showToast('error', { title, description, position });
