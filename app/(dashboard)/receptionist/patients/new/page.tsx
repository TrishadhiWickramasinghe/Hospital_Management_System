'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/app/context/AuthContext';
import apiClient from '@/lib/api';
import { CreatePatientRequest, BloodGroup, Gender, EmergencyRelation } from '@/types';
import { StepIndicator } from '@/components/patients/StepIndicator';
import { AllergyTagInput } from '@/components/patients/AllergyTagInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Zod schemas for each step
const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().refine(
    (date) => new Date(date) < new Date(),
    'Date of birth must be in the past'
  ),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'] as const),
  bloodGroup: z.enum([
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ] as const),
  nationalId: z.string().min(1, 'National ID is required'),
});

const step2Schema = z.object({
  phone: z
    .string()
    .regex(
      /^(\+94|0)[0-9]{9}$/,
      'Phone must be in format +94XXXXXXXXX or 07XXXXXXXX'
    ),
  email: z.string().email().optional().or(z.literal('')),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

const step3Schema = z.object({
  emergencyName: z.string().min(1, 'Emergency contact name is required'),
  emergencyPhone: z.string().regex(
    /^(\+94|0)[0-9]{9}$/,
    'Phone must be in format +94XXXXXXXXX or 07XXXXXXXX'
  ),
  emergencyRelation: z.enum([
    'SPOUSE',
    'PARENT',
    'SIBLING',
    'CHILD',
    'FRIEND',
    'OTHER',
  ] as const),
  insuranceNumber: z.string().optional().or(z.literal('')),
});

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;
type Step3Form = z.infer<typeof step3Schema>;

const steps = [
  { number: 1, title: 'Personal Information' },
  { number: 2, title: 'Contact Details' },
  { number: 3, title: 'Medical Information' },
];

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function NewPatientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, role, isLoading, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreatePatientRequest>>({
    allergies: [],
  });

  // Redirect if not authenticated or wrong role
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated || !['RECEPTIONIST', 'ADMIN'].includes(role || '')) {
    router.push('/unauthorized');
    return null;
  }

  // Create mutation
  const createPatientMutation = useMutation({
    mutationFn: async (data: CreatePatientRequest) => {
      const response = await apiClient.post<any>('/patients', data);
      return response.data;
    },
    onSuccess: (response) => {
      toast({
        title: 'Success',
        description: 'Patient registered successfully',
        variant: 'default',
      });
      const patientId = response.data?.id;
      router.push(`/receptionist/patients/${patientId}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to register patient';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });

  // Form for step 1
  const form1 = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      dateOfBirth: formData.dateOfBirth || '',
      gender: (formData.gender || 'MALE') as Gender,
      bloodGroup: (formData.bloodGroup || 'O+') as BloodGroup,
      nationalId: formData.nationalId || '',
    },
  });

  // Form for step 2
  const form2 = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      phone: formData.phone || '',
      email: formData.email || '',
      street: formData.address?.street || '',
      city: formData.address?.city || '',
      postalCode: formData.address?.postalCode || '',
    },
  });

  // Form for step 3
  const form3 = useForm<Step3Form>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      emergencyName: formData.emergencyContact?.name || '',
      emergencyPhone: formData.emergencyContact?.phone || '',
      emergencyRelation: (formData.emergencyContact?.relation || 'PARENT') as EmergencyRelation,
      insuranceNumber: formData.insuranceNumber || '',
    },
  });

  const handleStep1Next = async () => {
    const isValid = await form1.trigger();
    if (isValid) {
      setFormData({
        ...formData,
        ...form1.getValues(),
      });
      setCurrentStep(2);
    }
  };

  const handleStep2Next = async () => {
    const isValid = await form2.trigger();
    if (isValid) {
      const values = form2.getValues();
      setFormData({
        ...formData,
        phone: values.phone,
        email: values.email || undefined,
        address: {
          street: values.street,
          city: values.city,
          postalCode: values.postalCode,
        },
      });
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    const isValid = await form3.trigger();
    if (isValid) {
      const values = form3.getValues();
      const finalData: CreatePatientRequest = {
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        dateOfBirth: formData.dateOfBirth!,
        gender: formData.gender!,
        bloodGroup: formData.bloodGroup!,
        nationalId: formData.nationalId!,
        phone: formData.phone!,
        email: formData.email,
        address: formData.address!,
        allergies: formData.allergies || [],
        emergencyContact: {
          name: values.emergencyName,
          phone: values.emergencyPhone,
          relation: values.emergencyRelation,
        },
        insuranceNumber: values.insuranceNumber,
      };

      createPatientMutation.mutate(finalData);
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Register New Patient</h1>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="rounded-lg border border-slate-200 bg-white p-8">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Form {...form1}>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form1.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form1.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form1.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form1.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form1.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form1.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        {/* Step 2: Contact Details */}
        {currentStep === 2 && (
          <Form {...form2}>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form2.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+94 or 07" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form2.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form2.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form2.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Colombo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form2.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="60000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}

        {/* Step 3: Medical Information */}
        {currentStep === 3 && (
          <Form {...form3}>
            <form className="space-y-6">
              <FormItem>
                <FormLabel>Allergies (Enter allergy and press Enter)</FormLabel>
                <FormControl>
                  <AllergyTagInput
                    value={formData.allergies || []}
                    onChange={(allergies) =>
                      setFormData({ ...formData, allergies })
                    }
                  />
                </FormControl>
              </FormItem>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="mb-4 font-semibold text-slate-900">Emergency Contact</h3>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form3.control}
                    name="emergencyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form3.control}
                    name="emergencyPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+94 or 07" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form3.control}
                  name="emergencyRelation"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Relation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SPOUSE">Spouse</SelectItem>
                          <SelectItem value="PARENT">Parent</SelectItem>
                          <SelectItem value="SIBLING">Sibling</SelectItem>
                          <SelectItem value="CHILD">Child</SelectItem>
                          <SelectItem value="FRIEND">Friend</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form3.control}
                name="insuranceNumber"
                render={({ field }) => (
                  <FormItem className="pt-4">
                    <FormLabel>Insurance Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="INS123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleStep1Next || handleStep2Next}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createPatientMutation.isPending}
            >
              {createPatientMutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
