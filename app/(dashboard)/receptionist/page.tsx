'use client';

import { useAuth } from '@/app/context/AuthContext';

export default function ReceptionistDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Receptionist Dashboard
        </h1>
        <p className="text-slate-600 mt-2">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Today's Appointments</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">28</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Check-ins Today</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">24</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Pending Registrations</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">5</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm">Waiting Patients</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">6</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Main Tasks
        </h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li>Manage patient appointments and bookings</li>
          <li>Register new patients in the system</li>
          <li>Handle patient check-ins and check-outs</li>
          <li>Respond to patient inquiries</li>
        </ul>
      </div>
    </div>
  );
}
