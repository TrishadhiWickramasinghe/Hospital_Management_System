'use client';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AllergyBannerProps {
  allergies: string[];
}

export function AllergyBanner({ allergies }: AllergyBannerProps) {
  if (!allergies || allergies.length === 0) {
    return null;
  }

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertCircle className="h-5 w-5 text-red-600" />
      <AlertDescription className="text-red-800">
        <strong>Allergies:</strong> {allergies.join(', ')}
      </AlertDescription>
    </Alert>
  );
}
