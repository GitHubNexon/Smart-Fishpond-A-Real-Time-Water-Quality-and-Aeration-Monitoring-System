'use client';

import React, { useEffect, useRef } from 'react';
import { CircleUserRoundIcon, XIcon } from 'lucide-react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';

interface AvatarUploaderProps {
  value?: string;
  onChange?: (file: File | null, preview?: string) => void;
  readOnly?: boolean;
  size?: number;
}

export default function AvatarUploader({
  value = '',
  onChange,
  readOnly = false,
  size = 64,
}: AvatarUploaderProps) {
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({ accept: 'image/*' });

  const prevPreview = useRef<string | null>(null);

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Determine the actual preview to display
  const previewUrl = files[0]?.preview || value || null;

  // Call onChange when uploaded file changes OR initial value exists
  useEffect(() => {
    const processFile = async () => {
      if (files[0] && files[0].file instanceof File) {
        if (files[0].file && files[0].preview !== prevPreview.current) {
          const base64 = await fileToBase64(files[0].file);
          prevPreview.current = base64;
          onChange?.(files[0].file, base64);
        }
        return;
      }

      // No file uploaded, but value exists (initial profile image)
      if (!files[0] && value && value !== prevPreview.current) {
        prevPreview.current = value;
        onChange?.(null, value);
      }
    };

    processFile();
  }, [files, value, onChange]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        <button
          type="button"
          className={`border-input hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none ${
            readOnly ? 'pointer-events-none opacity-50' : ''
          }`}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={previewUrl ? 'Change image' : 'Upload image'}
          style={{ width: size, height: size }}
        >
          {previewUrl ? (
            <img
              className="w-full h-full object-cover"
              src={previewUrl}
              alt="Avatar"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="w-8 h-8 opacity-60" />
            </div>
          )}
        </button>

        {/* {!readOnly && previewUrl && (
          <Button
            onClick={() => removeFile(files[0]?.id)}
            size="icon"
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2"
            aria-label="Remove image"
          >
            <XIcon className="w-3.5 h-3.5" />
          </Button>
        )} */}

        {!readOnly && previewUrl && (
          <Button
            onClick={() => {
              removeFile(files[0]?.id);
              prevPreview.current = null;
              onChange?.(null, '');
            }}
            size="icon"
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2"
            aria-label="Remove image"
          >
            <XIcon className="w-3.5 h-3.5" />
          </Button>
        )}

        <input {...getInputProps()} className="sr-only" />
      </div>
    </div>
  );
}
