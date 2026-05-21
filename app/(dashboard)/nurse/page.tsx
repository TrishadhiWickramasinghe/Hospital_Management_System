'use client';

import { useAuth } from '@/app/context/AuthContext';

export default function NurseDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nurse Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Assigned Patients</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">15</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Pending Tasks</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">7</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Shift Duration</p>
          <p className="text-slate-900 font-bold mt-2">8 Hours</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Status</p>
          <p className="text-green-600 font-bold mt-2">On Duty</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Your Responsibilities
        </h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Monitor patient vitals and conditions</li>
          <li>Complete assigned medical tasks</li>
          <li>Update patient records</li>
          <li>Communicate with doctors about patient status</li>
        </ul>
      </div>
    </div>
  );
}
