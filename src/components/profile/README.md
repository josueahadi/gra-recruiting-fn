# Profile Components

This directory contains a set of reusable React components for displaying and editing user profiles in both applicant and admin contexts.

## Component Architecture

The components are designed with a modular approach and follow these principles:

1. **Role-based Rendering**: Components adapt their UI and functionality based on the user's role (applicant or admin)
2. **Composition**: Smaller, focused components are combined to build more complex views
3. **Single Source of Truth**: Data flows through a consistent structure
4. **Progressive Disclosure**: Edit functionality is only shown when relevant

## Available Components

### Core Components

- `ProfileInfoSection`: A wrapper for profile sections with optional edit capabilities
- `ProfileField`: Renders a field in either view or edit mode
- `ProfileAvatar`: Displays user avatar with upload capabilities

### Section Components

- `PersonalInfoSection`: For displaying and editing name, email, phone, etc.
- `AddressSection`: For displaying and editing location information
- `SkillsSection`: For displaying and editing technical skills, soft skills, and languages
- `WorkEducationSection`: For displaying and editing work experience and education
- `DocumentsSection`: For managing resume/CV, work samples, and portfolio links

### Container Component

- `UnifiedProfileView`: A complete profile view that combines all sections and manages data flow

## Usage

### Using the UnifiedProfileView (Recommended)

The easiest way to implement a profile view is to use the `UnifiedProfileView` component:

```tsx
import { UnifiedProfileView, ApplicantData } from '@/components/profile';

// Your component
const MyProfilePage = () => {
  const [profileData, setProfileData] = useState<ApplicantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data...

  return (
    <UnifiedProfileView
      id="user-id"
      userType="applicant" // or "admin"
      initialData={profileData}
      onDataChange={handleProfileUpdate}
      isLoading={isLoading}
    />
  );
};
```

### Using Individual Section Components

You can also use individual section components if you need more control:

```tsx
import { 
  PersonalInfoSection, 
  AddressSection, 
  SkillsSection,
  type PersonalInfo
} from '@/components/profile';

// Your component
const CustomProfileSection = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    bio: "Software engineer"
  });

  const handleUpdate = (info: PersonalInfo) => {
    setPersonalInfo(info);
    // Save to API...
  };

  return (
    <div>
      <PersonalInfoSection
        personalInfo={personalInfo}
        userType="applicant"
        onSave={handleUpdate}
      />
      {/* Add other sections as needed */}
    </div>
  );
};
```

## Data Structure

The `ApplicantData` interface is the core data structure that all components work with. See `UnifiedProfileView.tsx` for the complete type definition.

## Prop Types

Each component has a clearly defined set of props. See individual component files for detailed type definitions.

## Customization

The components use Tailwind CSS classes for styling and can be customized by:

1. Passing additional className props
2. Extending the base components
3. Modifying the core components directly

## Accessibility

All components are built with accessibility in mind:
- Proper label associations
- Keyboard navigation
- Screen reader friendly structure
- Appropriate ARIA attributes

## Example Implementation

See `user-profile.tsx` and `applicant-profile-view.tsx` for examples of how these components are used in the application.