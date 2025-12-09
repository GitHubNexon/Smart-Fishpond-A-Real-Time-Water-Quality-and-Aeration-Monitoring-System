'use client';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateEmployeeId } from '@/api/protected/employee.api';
import { FaKey } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

interface EmployeeIdGeneratorProps {
  value?: string;
  onChange: (newId: string) => void;
  mode?: 'add' | 'edit';
}

export default function EmployeeIdGenerator({
  value,
  onChange,
  mode = 'add',
}: EmployeeIdGeneratorProps) {
  const [loading, setLoading] = useState(false);

  const fetchEmployeeId = async () => {
    try {
      setLoading(true);
      const response = await generateEmployeeId();
      if (response?.status === 'success' && response?.data) {
        onChange(response.data);
      }
    } catch (error) {
      console.error('Error generating employee ID:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'add' && !value) {
      fetchEmployeeId();
    }
  }, [mode, value]);

  return (
    <div className="flex items-end space-x-2">
      <div className="flex-1">
        <div className="relative">
          <Input
            id="employeeId"
            value={value || ''}
            placeholder={loading ? 'Generating...' : 'Generated Employee ID'}
            readOnly
            className="pl-10"
          />
          <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {mode === 'add' && !value && (
        <Button
          type="button"
          onClick={fetchEmployeeId}
          variant="outline"
          size="sm"
          disabled={loading}
          className="whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating
            </>
          ) : (
            'Regenerate'
          )}
        </Button>
      )}
    </div>
  );
}
