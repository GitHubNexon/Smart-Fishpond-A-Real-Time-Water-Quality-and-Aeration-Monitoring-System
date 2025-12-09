import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function MySchedulePage() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-[400px] text-center shadow-lg">
        <CardHeader>
          <AlertCircle className="mx-auto mb-2 text-red-500" size={48} />
          <CardTitle>Work in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          This page is currently under development. Please check back later.
        </CardContent>
      </Card>
    </div>
  );
}
