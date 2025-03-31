"use client";

import React from 'react';
import { WorkEducationSection } from '@/components/profile';
import { type Education, type WorkExperience } from '@/hooks/use-profile';

interface WorkEducationTabProps {
  education: Education[];
  experience: WorkExperience[];
  onUpdate: (data: {
    education: Education[];
    experience: WorkExperience[];
  }) => void;
}

/**
 * Component for Work & Education tab in applicant view
 */
const WorkEducationTab: React.FC<WorkEducationTabProps> = ({
  education,
  experience,
  onUpdate
}) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-primary-base mb-6">Work & Education</h1>
      
      <WorkEducationSection
        education={education}
        experience={experience}
        canEdit={true}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default WorkEducationTab;
