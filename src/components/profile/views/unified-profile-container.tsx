import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PersonalInfoSection from '../sections/personal-info';
import AddressSection from '../sections/address';
import SkillsSection from '../sections/skills';
import WorkEducationSection from '../sections/work-education';
import DocumentsSection from '../sections/documents';
import { 
  useProfile
} from '@/hooks/use-profile';
import { cn } from '@/lib/utils';

interface ProfileContainerProps {
  userId?: string;
  userType: 'applicant' | 'admin';
  onNavigateBack?: () => void;
  wrapperClassName?: string;
  contentClassName?: string;
}

/**
 * A container component that handles all profile sections with consistent layout
 * Works for both applicant (self-view) and admin (viewing others) contexts
 */
const ProfileContainer: React.FC<ProfileContainerProps> = ({
  userId,
  userType,
  onNavigateBack,
  wrapperClassName,
  contentClassName
}) => {
  // Use the shared hook to manage profile data
  const {
    profileData,
    isLoading,
    error,
    updatePersonalInfo,
    updateAddress,
    updateSkills,
    updateWorkEducation,
    uploadFile,
    removeDocument,
    updatePortfolioLinks,
    canEdit
  } = useProfile({ 
    id: userId, 
    userType 
  });

  // Format location label for display
  const getLocationLabel = () => {
    if (!profileData) return undefined;
    
    const { city, country } = profileData.addressInfo;
    return city && country 
      ? `${city}/${country}` 
      : undefined;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base" />
      </div>
    );
  }

  // Render error state
  if (error || !profileData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-semibold mb-2">{error || "Profile Not Found"}</h2>
        {onNavigateBack && (
          <Button onClick={onNavigateBack} variant="outline">
            Go Back
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("", wrapperClassName)}>
      {/* Header with back button - only show for admin view */}
      {userType === 'admin' && onNavigateBack && (
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={onNavigateBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applicants
          </Button>
        </div>
      )}

      {/* Main profile content */}
      <div className={`bg-white rounded-lg p-6 md:px-10 shadow-md ${contentClassName}`}>
        <h1 className="text-2xl font-bold text-primary-base mb-6">
          {userType === 'admin' ? 'Applicant Profile' : 'User Profile'}
        </h1>

        {/* Personal Information Section */}
        <PersonalInfoSection
          personalInfo={profileData.personalInfo}
          avatarSrc={profileData.avatarSrc}
          locationLabel={getLocationLabel()}
          canEdit={canEdit}
          onInfoUpdate={updatePersonalInfo}
          onAvatarChange={(file) => uploadFile('avatar', file)}
        />

        <Separator className="my-6" />

        {/* Address Section */}
        <AddressSection
          addressInfo={profileData.addressInfo}
          canEdit={canEdit}
          onAddressUpdate={updateAddress}
        />

        {/* Department - visible only in admin view */}
        {userType === 'admin' && profileData.department && (
          <>
            <Separator className="my-6" />
            <div className="flex justify-between p-2">
              <h3 className="text-xl font-bold">Department</h3>
              <span className="text-xl">{profileData.department}</span>
            </div>
          </>
        )}

        <Separator className="my-6" />

        {/* Skills & Languages Section */}
        <SkillsSection
          technicalSkills={profileData.skills.technical}
          softSkills={profileData.skills.soft}
          languages={profileData.languages}
          canEdit={canEdit}
          onUpdate={({ technical, soft, languages }) => 
            updateSkills({ technical, soft, languages })
          }
        />

        <Separator className="my-6" />

        {/* Work & Education Section */}
        <WorkEducationSection
          education={profileData.education}
          experience={profileData.experience}
          canEdit={canEdit}
          onUpdate={({ education, experience }) => 
            updateWorkEducation({ education, experience })
          }
        />

        <Separator className="my-6" />

        {/* Documents & Portfolio Section */}
        <DocumentsSection
          resume={profileData.documents.resume}
          samples={profileData.documents.samples}
          portfolioLinks={profileData.portfolioLinks}
          canEdit={canEdit}
          onFileUpload={uploadFile}
          onFileRemove={removeDocument}
          onLinksUpdate={updatePortfolioLinks}
        />
      </div>
    </div>
  );
};

export default ProfileContainer;
