'use client';

import React, { useEffect, useState } from 'react';
import { ComboBox } from '@/components/customs/combobox/combo-box.component';
import { GoPackage } from 'react-icons/go';
import { extractErrorMessage } from '@/configs/api.helper';
import { toast } from '@/components/ui/sonner';
import { getAllAssetListVerified } from '@/api/protected/assets-api/asset.api';
import { AssetsInfo } from '@/interfaces/assets.interface';
import { ComboBoxDataViewer } from '@/components/customs/combo-box-data-viewer';
import { formatNumber } from '@/lib/format-number.util';
import { formatDate } from '@syntaxsentinel/date-utils';

interface VerifiedAssetPickerProps {
  value: any | null;
  onSelect: (asset: any | null) => void;
}

export default function VerifiedAssetPicker({
  value,
  onSelect,
}: VerifiedAssetPickerProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedAssets = Array.isArray(value) ? value : value ? [value] : [];

  const selected =
    value && assets.length > 0
      ? assets.find((a) => a.id === value.id) || null
      : null;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getAllAssetListVerified(value?.id);
        setAssets(res.data || []);
      } catch (e) {
        const message = extractErrorMessage(e);
        toast.error({
          title: 'Failed to fetch assets',
          description: message,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <ComboBox
        options={assets}
        value={selected}
        onSelect={onSelect}
        searchKey={['assetName', 'assetNo', 'manufacturer']}
        loading={loading}
        placeholder="Search assets..."
        isClearable
        icon={<GoPackage />}
      />
      {/* Show data viewer only when there are selected assets */}
      {selected && (
        <ComboBoxDataViewer dialogTitle="Asset Details" maxWidth="max-w-lg">
          <div className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">{selected.assetName}</p>
                <p className="text-xs text-gray-500">{selected.assetNo}</p>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm">{selected.assetDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Manufacturer</p>
                    <p className="text-sm">{selected.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="text-sm">
                      {formatNumber.quantity(selected.currentQuantity)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Acquisition Cost</p>
                  <p className="text-sm font-semibold">
                    {formatNumber.currency(selected.acquisitionCost)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Acquisition Date</p>
                    <p className="text-sm">
                      {formatDate.shortDate(selected.acquisitionDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Warranty Date</p>
                    <p className="text-sm">
                      {formatDate.shortDate(selected.warrantyDate)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="flex gap-1 flex-wrap">
                      {selected.isVerified && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                          Verified
                        </span>
                      )}
                      {selected.isApproved && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          Approved
                        </span>
                      )}
                      {selected.isDraft && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ComboBoxDataViewer>
      )}
    </div>
  );
}
