'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/context/AuthContext';
import apiClient from '@/lib/api';
import { Patient } from '@/types';
import { PatientCard } from '@/components/patients/PatientCard';
import { AllergyBanner } from '@/components/patients/AllergyBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PatientProfilePage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not authenticated
  if (isAuthLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  // Fetch patient details
  const { data: patient, isLoading, error } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      const response = await apiClient.get<Patient>(`/patients/${patientId}`);
      return response.data;
    },
  });

  // Fetch medical records
  const { data: medicalRecords, isLoading: medicalLoading } = useQuery({
    queryKey: ['medical-records', patientId],
    queryFn: async () => {
      try {
        const response = await apiClient.get<any[]>(`/medical-records/patient/${patientId}`);
        return response.data || [];
      } catch {
        return [];
      }
    },
  });

  // Fetch appointments
  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments', patientId],
    queryFn: async () => {
      try {
        const response = await apiClient.get<any[]>(`/appointments?patientId=${patientId}`);
        return response.data || [];
      } catch {
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-3 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-500 mx-auto" />
          <p className="text-slate-600">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-600">Failed to load patient details</p>
        <Link href="/receptionist/patients">
          <Button>Back to Patients</Button>
        </Link>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/receptionist/patients">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Patient Card */}
      <PatientCard patient={patient} />

      {/* Allergy Banner */}
      {patient.allergies && patient.allergies.length > 0 && (
        <AllergyBanner allergies={patient.allergies} />
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-6 text-lg font-semibold text-slate-900">Personal Information</h3>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-slate-600">First Name</p>
                <p className="mt-1 font-semibold text-slate-900">{patient.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Last Name</p>
                <p className="mt-1 font-semibold text-slate-900">{patient.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Age</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {calculateAge(patient.dateOfBirth)} years
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Date of Birth</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(patient.dateOfBirth)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Gender</p>
                <p className="mt-1 font-semibold text-slate-900">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Blood Group</p>
                <p className="mt-1">
                  <Badge className="bg-red-100 text-red-800">{patient.bloodGroup}</Badge>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-6 text-lg font-semibold text-slate-900">Contact Information</h3>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="mt-1 font-semibold text-slate-900">{patient.phone}</p>
              </div>
              {patient.email && (
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="mt-1 font-semibold text-slate-900">{patient.email}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-600">Address</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {patient.address.street}, {patient.address.city}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-6 text-lg font-semibold text-slate-900">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="mt-1 font-semibold text-slate-900">{patient.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="mt-1 font-semibold text-slate-900">{patient.emergencyContact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Relation</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {patient.emergencyContact.relation}
                </p>
              </div>
            </div>
          </div>

          {(patient.allergies?.length > 0 || patient.insuranceNumber) && (
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="mb-6 text-lg font-semibold text-slate-900">Medical & Insurance</h3>
              <div className="grid grid-cols-2 gap-6">
                {patient.allergies?.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-600">Allergies</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {patient.allergies.map((allergy) => (
                        <Badge key={allergy} className="bg-red-100 text-red-800">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {patient.insuranceNumber && (
                  <div>
                    <p className="text-sm text-slate-600">Insurance Number</p>
                    <p className="mt-1 font-semibold text-slate-900">{patient.insuranceNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="medical" className="space-y-4">
          {medicalLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="space-y-3 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-500 mx-auto" />
                <p className="text-slate-600">Loading medical records...</p>
              </div>
            </div>
          ) : medicalRecords && medicalRecords.length > 0 ? (
            medicalRecords.map((record, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-start gap-4">
                  <FileText className="mt-1 h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{record.title || 'Medical Record'}</h4>
                    <p className="mt-1 text-sm text-slate-600">{record.description}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatDateTime(record.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-slate-400" />
              <p className="text-slate-600">No medical records found</p>
            </div>
          )}
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          {appointmentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="space-y-3 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-500 mx-auto" />
                <p className="text-slate-600">Loading appointments...</p>
              </div>
            </div>
          ) : appointments && appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-start gap-4">
                  <Calendar className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">
                      {appointment.doctorName || 'Appointment'}
                    </h4>
                    <p className="mt-1 text-sm text-slate-600">{appointment.reason}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatDateTime(appointment.appointmentDate)}
                    </p>
                    {appointment.status && (
                      <div className="mt-2">
                        <Badge
                          className={
                            appointment.status === 'CONFIRMED'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="mb-4 h-12 w-12 text-slate-400" />
              <p className="text-slate-600">No appointments found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
