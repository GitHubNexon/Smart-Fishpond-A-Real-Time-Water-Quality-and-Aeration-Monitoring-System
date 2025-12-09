'use client';

import * as React from 'react';
import AssetInformation from './asset-information';

interface AssetInformationPageProps {
  params: Promise<{ assetId: string }>;
}

export default function AssetInformationPage({
  params,
}: AssetInformationPageProps) {
  const resolvedParams = React.use(params);

  return (
    <div className="mx-auto p-8">
      <AssetInformation assetId={resolvedParams.assetId} />
    </div>
  );
}
