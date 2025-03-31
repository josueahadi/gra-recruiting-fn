"use client";

import AppLayout from '@/components/layout/app-layout';
import ProfileContent from '@/components/applicant/profile/profile-content';

export default function ApplicantDocumentsPage() {
  return (
    <AppLayout userType="applicant">
      <ProfileContent />
    </AppLayout>
  );
}