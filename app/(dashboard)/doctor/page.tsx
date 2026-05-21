'use client';

import { useAuth } from '@/app/context/AuthContext';

export default function DoctorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Doctor Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back, Dr. {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">My Patients</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">42</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Today's Appointments</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Pending Reports</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Department</p>
          <p className="text-slate-900 font-bold mt-2">{user?.department}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>View and manage your patient list</li>
          <li>Review and schedule appointments</li>
          <li>Access medical records</li>
          <li>Generate reports</li>
        </ul>
      </div>
    </div>
  );
}
