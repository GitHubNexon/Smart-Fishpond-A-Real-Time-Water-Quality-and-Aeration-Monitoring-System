'use client';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateAssetNo } from '@/api/protected/assets-api/asset.api';
import { FaKey } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

interface AssetNoGeneratorProps {
  value?: string;
  onChange: (newNo: string) => void;
  mode?: 'add' | 'edit';
}

export default function AssetNoGenerator({
  value,
  onChange,
  mode = 'add',
}: AssetNoGeneratorProps) {
  const [loading, setLoading] = useState(false);

  const fetchAssetNo = async () => {
    try {
      setLoading(true);
      const response = await generateAssetNo();
      if (response?.status === 'success' && response?.data) {
        onChange(response.data);
      }
    } catch (error) {
      console.error('Error generating asset number:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchAssetNo();
  // }, []);

  useEffect(() => {
    if (mode === 'add' && !value) {
      fetchAssetNo();
    }
  }, [mode, value]);

  return (
    <div className="flex items-end space-x-2">
      <div className="flex-1">
        <div className="relative">
          <Input
            id="assetNo"
            value={value || ''}
            placeholder={loading ? 'Generating...' : 'Generated Asset No'}
            readOnly
            className="pl-10 h-11"
          />
          <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {mode === 'add' && !value && (
        <Button
          type="button"
          onClick={fetchAssetNo}
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
