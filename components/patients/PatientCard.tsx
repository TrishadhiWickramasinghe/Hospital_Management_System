'use client';

import { Patient } from '@/types';
import { Badge } from '@/components/ui/badge';

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarBgColor = (id: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-emerald-500',
    ];
    const hash = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    return colors[hash % colors.length];
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
      {/* Avatar */}
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full font-bold text-white ${getAvatarBgColor(
          patient.id
        )}`}
      >
        {getInitials(patient.firstName, patient.lastName)}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-900">
            {patient.firstName} {patient.lastName}
          </h3>
          <Badge variant="secondary">{patient.patientId}</Badge>
        </div>
        <p className="mt-1 text-sm text-slate-600">{patient.email || patient.phone}</p>
        <div className="mt-2 flex items-center gap-2">
          <Badge
            className="bg-red-100 text-red-800"
            variant="outline"
          >
            Blood: {patient.bloodGroup}
          </Badge>
        </div>
      </div>
    </div>
  );
}
