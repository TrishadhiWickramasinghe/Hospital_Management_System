'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/context/AuthContext';
import { useDebounce } from '@/hooks/use-debounce';
import apiClient from '@/lib/api';
import { PatientListItem, PaginatedResponse, BloodGroup } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit2, Plus, Users } from 'lucide-react';

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function PatientsPage() {
  const router = useRouter();
  const { role, isLoading, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Redirect if not authenticated
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch patients
  const { data, isLoading: isFetching, error } = useQuery({
    queryKey: ['patients', debouncedSearch, bloodGroupFilter, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
      });

      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }

      if (bloodGroupFilter !== 'all') {
        params.append('bloodGroup', bloodGroupFilter);
      }

      const response = await apiClient.get<PaginatedResponse<PatientListItem>>(
        `/patients?${params.toString()}`
      );
      return response.data;
    },
  });

  const patients = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

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
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Patients</h1>
          <p className="mt-1 text-slate-600">
            Total: {totalElements} patient{totalElements !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/receptionist/patients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Register Patient
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(0);
          }}
          className="flex-1"
        />
        <Select value={bloodGroupFilter} onValueChange={(value) => {
          setBloodGroupFilter(value);
          setCurrentPage(0);
        }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Blood Groups</SelectItem>
            {bloodGroups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white">
        {isFetching ? (
          <div className="flex items-center justify-center py-12">
            <div className="space-y-3 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-500 mx-auto" />
              <p className="text-slate-600">Loading patients...</p>
            </div>
          </div>
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-slate-400" />
            <p className="text-slate-600">No patients found</p>
            <p className="text-sm text-slate-500">
              {searchQuery || bloodGroupFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by registering a new patient'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registered Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-semibold">
                    <Badge variant="outline">{patient.patientId}</Badge>
                  </TableCell>
                  <TableCell>
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell>{calculateAge(patient.dateOfBirth)} years</TableCell>
                  <TableCell>
                    <Badge
                      className="bg-red-100 text-red-800"
                      variant="outline"
                    >
                      {patient.bloodGroup}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{formatDate(patient.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/receptionist/patients/${patient.id}`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
