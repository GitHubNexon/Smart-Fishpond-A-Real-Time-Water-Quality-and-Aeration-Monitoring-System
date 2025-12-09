// src/app/(private)/par-form/[par-no]/page.tsx

import ParFormTemplate from './par-form'; // import the client component

export default function ParFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ParFormTemplate />
    </div>
  );
}
