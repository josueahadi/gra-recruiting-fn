"use client";

import React from 'react';
import { SkillsSection } from '@/components/profile';
import { type Skill, type LanguageProficiency } from '@/hooks/use-profile';

interface SkillsTabProps {
  technicalSkills: Skill[];
  softSkills: Skill[];
  languages: LanguageProficiency[];
  onUpdate: (data: {
    technical: Skill[];
    soft: Skill[];
    languages: LanguageProficiency[];
  }) => void;
}

/**
 * Component for Skills tab in applicant view
 */
const SkillsTab: React.FC<SkillsTabProps> = ({
  technicalSkills,
  softSkills,
  languages,
  onUpdate
}) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-primary-base mb-6">Skills & Competence</h1>
      
      <SkillsSection
        technicalSkills={technicalSkills}
        softSkills={softSkills}
        languages={languages}
        canEdit={true}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default SkillsTab;
