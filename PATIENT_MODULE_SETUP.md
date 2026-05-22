# Patient Registration Module - Setup Instructions

## ✅ Created Files

### Types
- **types/index.ts** - Added Patient-related types:
  - `Patient`, `PatientListItem`, `CreatePatientRequest`
  - `Address`, `EmergencyContact`
  - `Gender`, `BloodGroup`, `EmergencyRelation`
  - `PaginatedResponse<T>`

### Pages (App Router)
1. **app/(dashboard)/receptionist/patients/new/page.tsx**
   - Multi-step registration form with 3 steps
   - Uses react-hook-form + Zod validation
   - Step 1: Personal Information
   - Step 2: Contact Details  
   - Step 3: Medical Information & Emergency Contact

2. **app/(dashboard)/receptionist/patients/page.tsx**
   - Patient list with search & filtering
   - Debounced search (300ms)
   - Blood group filter
   - Pagination (10 items per page)
   - Age calculation from DOB

3. **app/(dashboard)/receptionist/patients/[id]/page.tsx**
   - Patient profile view with tabs
   - Overview: All demographic data
   - Medical History: Read-only medical records
   - Appointments: Scheduled appointments

### Shared Components
- **components/patients/StepIndicator.tsx** - Multi-step form progress indicator
- **components/patients/AllergyTagInput.tsx** - Tag input for allergies (add with Enter, remove with X)
- **components/patients/PatientCard.tsx** - Patient summary card with avatar & badge
- **components/patients/AllergyBanner.tsx** - Red alert banner for allergies

### UI Components (shadcn/ui)
- **components/ui/select.tsx** - Select dropdown (Radix UI)
- **components/ui/table.tsx** - Table component
- **components/ui/badge.tsx** - Badge component
- **components/ui/alert.tsx** - Alert/notification banner
- **components/ui/tabs.tsx** - Tabbed interface (Radix UI)

### Hooks
- **hooks/use-toast.ts** - Toast notification hook
- **hooks/use-debounce.ts** - Debounce hook for search

## 🔐 Access Control

### Role-Based Routes
- **Only RECEPTIONIST & ADMIN can access:**
  - `/receptionist/patients/new` (registration form)
  - Edit functionality (edit button on list)
  
- **All authenticated roles can view:**
  - `/receptionist/patients` (patient list)
  - `/receptionist/patients/[id]` (patient profile)

**Implementation:**
- Checks `isAuthenticated` and `role` from AuthContext
- Redirects to `/unauthorized` if insufficient permissions
- Shows loading spinner during auth check

## 📋 API Integration

### TanStack Query (React Query)
All API calls use `useQuery` and `useMutation`:

1. **Create Patient** (POST `/api/patients`)
   ```typescript
   useMutation({
     mutationFn: (data: CreatePatientRequest) => apiClient.post('/patients', data),
     onSuccess: () => router.push(`/receptionist/patients/${id}`),
     onError: (error) => toast with error message
   })
   ```

2. **Fetch Patients** (GET `/api/patients?search=&bloodGroup=&page=&size=10`)
   ```typescript
   useQuery({
     queryKey: ['patients', search, bloodGroup, page],
     queryFn: () => apiClient.get('/patients?...')
   })
   ```

3. **Fetch Patient Details** (GET `/api/patients/:id`)
   ```typescript
   useQuery({
     queryKey: ['patient', id],
     queryFn: () => apiClient.get(`/patients/${id}`)
   })
   ```

4. **Fetch Medical Records** (GET `/api/medical-records/patient/:id`)
5. **Fetch Appointments** (GET `/api/appointments?patientId=:id`)

### Error Handling
- Shows error toast with `ApiResponse.message`
- Catches 401 errors automatically (axios interceptor)
- Graceful fallback if medical records/appointments endpoints unavailable

## 🎨 Form Validation

### Step 1: Personal Info
- firstName: required
- lastName: required
- dateOfBirth: required, must be past date
- gender: required (MALE, FEMALE, OTHER)
- bloodGroup: required (8 options: A+, A-, B+, B-, AB+, AB-, O+, O-)
- nationalId: required, unique

### Step 2: Contact Details
- phone: required, regex pattern: `+94XXXXXXXXX` or `07XXXXXXXX`
- email: optional, valid email format
- address: street, city, postalCode (all required)

### Step 3: Medical Info
- allergies: optional, tag-based input (press Enter to add)
- emergencyContact: name, phone (regex), relation (required)
- insuranceNumber: optional

## 🔄 State Management

### Form Data Persistence
- Multi-step form data stored in local state across steps
- Back button preserves entered data
- Submit redirects to profile page with patient ID

### Search & Pagination
- Search query auto-clears pagination (back to page 0)
- Filter changes also reset pagination
- Debounced search to avoid excessive API calls

## 📱 Responsive Design

- Grid layouts collapse on mobile
- Table scrolls horizontally on small screens
- Touch-friendly button sizes

## 🚀 Dependencies Required

Ensure these are installed in package.json:
- `@tanstack/react-query` - API state management
- `@radix-ui/react-select` - Select component
- `@radix-ui/react-tabs` - Tabs component
- `react-hook-form` - Form state
- `@hookform/resolvers` - Zod integration
- `zod` - Validation
- `lucide-react` - Icons
- `class-variance-authority` - Badge variants

## 🧪 Testing the Module

1. **Register a Patient:**
   - Go to `/receptionist/patients/new`
   - Fill multi-step form (all validation will work)
   - Submit to create patient

2. **View Patient List:**
   - Go to `/receptionist/patients`
   - Search by name/email/phone
   - Filter by blood group
   - Paginate through results

3. **View Patient Profile:**
   - Click "View" button in patient list
   - See patient card with badge & blood group
   - View allergies in banner if present
   - Check overview, medical history, appointments tabs

## ⚠️ Notes

- Medical records and appointments endpoints may return empty lists initially (day 2 data)
- All times display in user's local timezone
- Patient age calculated from dateOfBirth, not stored separately
- Allergy banner only shown if allergies exist
- Edit button on list is placeholder (can implement edit page similarly)
