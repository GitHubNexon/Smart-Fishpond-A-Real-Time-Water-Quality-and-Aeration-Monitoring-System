'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getParForm } from '@/api/protected/assets-api/asset-transaction.api';
import { formatDate } from '@syntaxsentinel/date-utils';
import { formatNumber } from '@/utils/format-number.util';
import PrintWrapper from '@/components/customs/print-wrapper';

interface Asset {
  transactionNo: string;
  transactioDate: string;
  inventoryId: string;
  assetCode: string;
  assetName: string;
  amount: string;
  condition: string;
  remarks: string | null;
}

interface ParData {
  parNo: string;
  custodian: {
    name: string;
    employeeNo: string;
    position: string;
    office: string;
  };
  endUser: { name: string; position: string; office: string };
  preparedBy: { name: string };
  approvedBy: { name: string };
  assets: Asset[];
}

export default function ParFormTemplate() {
  const params = useParams();
  const [parData, setParData] = useState<ParData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPar = async () => {
      const parNo = Array.isArray(params['par-no'])
        ? params['par-no'][0]
        : params['par-no'];

      if (!parNo) return;

      try {
        const response = await getParForm(parNo);
        setParData({
          ...response.data,
          endUser: {
            name: response.data.custodian?.name || '',
            position: response.data.custodian?.position || '',
            office: response.data.custodian?.office || '',
          },
          custodian: {
            name: response.data.approvedBy?.name || '',
            employeeNo: '',
            position: '',
            office: '',
          },
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPar();
  }, [params]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 font-medium">
        Loading...
      </div>
    );

  if (!parData)
    return (
      <div className="text-center py-20 text-gray-600 font-medium">
        No PAR data found.
      </div>
    );

  const displayAssets = [...parData.assets];
  const rowsToAdd = Math.max(0, 25 - displayAssets.length);
  for (let i = 0; i < rowsToAdd; i++) {
    displayAssets.push({
      transactionNo: '',
      transactioDate: '',
      inventoryId: '',
      assetCode: '',
      assetName: '',
      amount: '',
      condition: '',
      remarks: null,
    });
  }

  return (
    <PrintWrapper
      buttonText="Print PAR Form"
      buttonClassName="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md no-print"
      showButton={true}
      onBeforePrint={() => console.log('Printing started...')}
      onAfterPrint={() => console.log('Printing completed.')}
    >
      <div className="max-w-4xl mx-auto p-8 bg-white text-black border border-black print:p-0 print:border-none">
        {/* Header & Info Section (Appendix 71 moved up) */}
        <div className="flex justify-end text-xs mb-1">
          <p>Appendix 71</p>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-lg font-bold uppercase">
            PROPERTY ACKNOWLEDGMENT RECEIPT
          </h1>
        </div>

        {/* Info Section */}
        <div className="text-sm mb-2">
          <div className="flex mb-1">
            <p className="mr-2">Entity Name:</p>
            <p className="flex-grow border-b border-black"></p>
          </div>
          <div className="flex mb-1">
            <p className="mr-2">Fund Cluster:</p>
            <p className="flex-grow border-b border-black"></p>
            <p className="ml-4 mr-2">PAR No.:</p>
            <p className="border-b border-black w-40">{parData.parNo}</p>
          </div>
        </div>

        {/* Assets Table */}
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr>
              <th className="border border-black px-2 py-1 w-1/12">Quantity</th>
              <th className="border border-black px-2 py-1 w-1/12">Unit</th>
              <th className="border border-black px-2 py-1 w-4/12">
                Description
              </th>
              <th className="border border-black px-2 py-1 w-2/12">
                Property Number
              </th>
              <th className="border border-black px-2 py-1 w-2/12">
                Date Acquired
              </th>
              <th className="border border-black px-2 py-1 w-1/12">Amount</th>
            </tr>
          </thead>
          <tbody>
            {displayAssets.map((asset, index) => (
              <tr key={index} className="text-center h-6">
                <td className="border border-black px-2 py-1 align-top">
                  {asset.assetName ? 1 : ''}
                </td>
                <td className="border border-black px-2 py-1 align-top">
                  {asset.assetName ? 'Unit' : ''}
                </td>
                <td className="border border-black px-2 py-1 text-left align-top">
                  {asset.assetName}
                </td>
                <td className="border border-black px-2 py-1 align-top">
                  {asset.assetCode}
                </td>
                <td className="border border-black px-2 py-1 align-top">
                  {asset.transactioDate
                    ? formatDate.shortDate(asset.transactioDate)
                    : ''}
                </td>
                <td className="border border-black px-2 py-1 text-right align-top">
                  {asset.amount ? formatNumber(Number(asset.amount)) : ''}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="border-t border-black p-0">
                <div className="grid grid-cols-2">
                  {/* Left Side: Received By / End User */}
                  <div
                    className="border-r border-black p-4 text-center"
                    style={{ padding: '1rem' }}
                  >
                    <p
                      className="text-left font-normal mb-2"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      Received by:
                    </p>

                    <div className="pt-8 flex justify-center">
                      <div className="w-64 border-b border-black text-center font-bold text-base">
                        {parData.endUser.name.toUpperCase()}
                      </div>
                    </div>
                    <p className="mt-1 text-xs">
                      Signature over Printed Name of End User
                    </p>

                    <div className="mt-4 flex justify-center">
                      <div className="w-64 border-b border-black text-center text-sm">
                        {parData.endUser.position} / {parData.endUser.office}
                      </div>
                    </div>
                    <p className="mt-1 text-xs">Position/Office</p>

                    <div className="mt-4 flex justify-center">
                      <div className="w-64 border-b border-black text-center text-sm">
                        <span className="invisible">
                          {formatDate.shortDate(new Date())}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs">Date</p>
                  </div>

                  {/* Right Side: Issued By / Property Custodian */}
                  <div className="p-4 text-center" style={{ padding: '1rem' }}>
                    <p
                      className="text-left font-normal mb-2"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      Issued by:
                    </p>

                    <div className="pt-8 flex justify-center">
                      <div className="w-64 border-b border-black text-center font-bold text-base">
                        {parData.custodian.name.toUpperCase()}
                      </div>
                    </div>
                    <p className="mt-1 text-xs">
                      Signature over Printed Name of Supply and/or Property
                      Custodian
                    </p>

                    <div className="mt-4 flex justify-center">
                      <div className="w-64 border-b border-black text-center text-sm">
                        {parData.custodian.position} /{' '}
                        {parData.custodian.office}
                      </div>
                    </div>
                    <p className="mt-1 text-xs">Position/Office</p>

                    <div className="mt-4 flex justify-center">
                      <div className="w-64 border-b border-black text-center text-sm ">
                        <span className="invisible">
                          {formatDate.shortDate(new Date())}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs">Date</p>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </PrintWrapper>
  );
}
