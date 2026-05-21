'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  const { role } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Access Denied
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          You do not have permission to access this page.
        </p>
        <Link href={`/${role?.toLowerCase()}`}>
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
