# Unified Profile System Implementation Guide

## Overview

The unified profile system provides a consistent approach to displaying and editing user profiles across both applicant and admin contexts. This guide will help you implement the system in your project.

## Key Features

- **Shared Data Structure**: Consistent profile data model across the application
- **Custom Hook**: `useProfile` hook manages state and operations for both contexts
- **Reusable Components**: Modular components that work in both applicant and admin views
- **Consistent UI**: Matching design language across all profile sections
- **Role-Based Permissions**: Automatic handling of edit permissions based on user type

## Directory Structure

```
hooks/
  use-profile.ts                         # Shared hook for profile data management

components/
  profile/
    core/
      ProfileSection.tsx                 # Base section component with edit controls
    sections/
      personal-info.tsx                  # User info with avatar
      address.tsx                        # Address information
      skills.tsx                         # Technical skills, soft skills, languages
      work-education.tsx                 # Education history and work experience
      documents.tsx                      # Resume, work samples, portfolio links
    views/
      xunified-profile-container.tsx        # Main container that combines all sections
    index.ts                             # Exports for easier imports
```

## Migration Strategy

To ensure a smooth transition from your current implementation to the unified system, follow these steps:

1. **Start with the Hook**: Implement the `useProfile` hook first and test it with your existing components
2. **Migrate Section by Section**: Replace each section of your current profile components with the unified versions
3. **Update Your API Calls**: Modify the hook to work with your actual API endpoints
4. **Test Both Contexts**: Ensure the components work correctly in both applicant and admin contexts

### Data Mapping Considerations

Your current data structure may not match the unified profile data format exactly. You'll need to:

1. **Map API Responses**: Transform your API responses to match the unified data format
2. **Transform Updates**: When sending updates, convert the unified format back to your API's expected format
3. **Handle Special Fields**: Account for any special fields that exist in your current implementation

```typescript
// Example data mapping function
function mapApiResponseToProfileData(apiData) {
  return {
    id: apiData.id,
    personalInfo: {
      firstName: apiData.first_name,
      lastName: apiData.last_name,
      email: apiData.email,
      phone: apiData.phone_number,
      bio: apiData.bio || '',
    },
    addressInfo: {
      country: apiData.country,
      city: apiData.city,
      postalCode: apiData.postal_code || '',
      address: apiData.address || '',
    },
    // Map remaining fields...
  };
}
```

## Integration Steps

### 1. Add the Required Files

Copy all the files from the artifacts to your project, maintaining the directory structure.

### 2. Update Tailwind Config

Ensure your `tailwind.config.js` includes the necessary color definitions:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Make sure these match your design system
        primary: {
          base: "#39ade3",
          dark: "#154C63",
          // Other shades...
        },
        // Other colors...
      },
    },
  },
  // Other configurations...
};
```

### 3. Add Icons

Make sure you have the required icons:

```tsx
// components/icons/edit-1.tsx
import { SVGProps } from "react";

export const Edit1 = (props: SVGProps<SVGSVGElement>) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M12 20H21" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M16.5 3.50001C16.8978 3.10219 17.4374 2.87869 18 2.87869C18.2786 2.87869 18.5544 2.93356 18.8118 3.04015C19.0692 3.14674 19.303 3.30303 19.5 3.50001C19.697 3.697 19.8532 3.93085 19.9598 4.18822C20.0665 4.44559 20.1213 4.72144 20.1213 5.00001C20.1213 5.27859 20.0665 5.55444 19.9598 5.81181C19.8532 6.06918 19.697 6.30303 19.5 6.50001L7 19L3 20L4 16L16.5 3.50001Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);
```

### 4. Add the Required Dependencies

Ensure you have all necessary dependencies in your project:

```
@radix-ui/react-avatar
@radix-ui/react-separator
lucide-react
react-icons/hi
```

### 5. Integration in Applicant View

Replace your current applicant profile implementation with the new unified component:

```tsx
// app/applicant/page.tsx OR app/applicant/profile/page.tsx
"use client";

import { ProfileContainer } from '@/components/profile';

export default function ApplicantProfilePage() {
  return (
    <ProfileContainer
      userType="applicant"
      wrapperClassName="max-w-4xl mx-auto"
    />
  );
}
```

### 6. Integration in Admin View

Replace your current admin applicant view with the new unified component:

```tsx
// app/admin/applicants/[id]/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { ProfileContainer } from '@/components/profile';

interface ApplicantProfilePageProps {
  params: {
    id: string;
  };
}

export default function ApplicantProfilePage({ params }: ApplicantProfilePageProps) {
  const router = useRouter();
  
  const handleGoBack = () => {
    router.push('/admin/applicants');
  };
  
  return (
    <ProfileContainer
      userId={params.id}
      userType="admin"
      onNavigateBack={handleGoBack}
      wrapperClassName="max-w-4xl mx-auto"
    />
  );
}
```

## Customization Options

### API Integration

The `use-profile.ts` hook should be modified to work with your actual API endpoints:

```typescript
// In useProfile hook
useEffect(() => {
  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoints
      const endpoint = userType === 'admin' && id 
        ? `/api/applicants/${id}` 
        : '/api/me/profile';
        
      const response = await fetch(endpoint);
      const data = await response.json();
      
      setProfileData(data);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data');
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  fetchProfileData();
}, [toast, userType, id]);
```

Similarly, update the data mutation functions to use your actual API endpoints.

### Layout Customization

The `ProfileContainer` component accepts props to customize the layout:

```tsx
<ProfileContainer
  userId={id}                           // Optional - only needed for admin view
  userType="admin"                      // "admin" or "applicant"
  onNavigateBack={handleGoBack}         // Optional - enables back button
  wrapperClassName="custom-wrapper"     // Optional - container styling
  contentClassName="custom-content"     // Optional - content area styling
/>
```

### Section Customization

If you need to customize individual sections, you can import them directly:

```tsx
import { PersonalInfoSection, AddressSection } from '@/components/profile';
import { useProfile } from '@/hooks/use-profile';

function CustomProfilePage() {
  const { 
    profileData, 
    updatePersonalInfo, 
    canEdit 
  } = useProfile({ userType: 'applicant' });
  
  if (!profileData) return <div>Loading...</div>;
  
  return (
    <div className="space-y-6">
      <PersonalInfoSection
        personalInfo={profileData.personalInfo}
        avatarSrc={profileData.avatarSrc}
        canEdit={canEdit}
        onInfoUpdate={updatePersonalInfo}
        onAvatarChange={(file) => uploadFile('avatar', file)}
      />
      
      {/* You can add other sections as needed */}
      
    </div>
  );
}
```

### Theming and Design

The components use Tailwind CSS classes and can be themed by adjusting your color scheme:

1. **Primary Colors**: Update the primary color definitions in your Tailwind config
2. **Component Spacing**: Modify the spacing and padding in each component
3. **Typography**: Adjust the font sizes and weights to match your design

## Best Practices

### Component Composition

- **Keep Components Focused**: Each section should handle one specific aspect of the profile
- **Minimize Prop Drilling**: Use the context provided by the hook rather than passing props down multiple levels
- **Use Semantic HTML**: Ensure proper use of headings, labels, and ARIA attributes

### State Management

- **Single Source of Truth**: Let the `useProfile` hook manage all profile-related state
- **Optimistic Updates**: Update the UI immediately on changes and revert on errors
- **Form Validation**: Add validation before submitting changes

### Performance Optimization

- **Memoization**: Use React.memo and useCallback for components and handlers that don't need frequent re-renders
- **Lazy Loading**: Consider lazy loading sections that are not immediately visible
- **Debounce Inputs**: For fields that trigger API calls, debounce the input handlers

## Conclusion

This unified profile system provides a consistent, maintainable way to display and edit user profiles across your application. By sharing components between admin and applicant views, you ensure a consistent experience while reducing code duplication.

For any questions or further customization needs, refer to the comments in the component files or reach out to the development team.