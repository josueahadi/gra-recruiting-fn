"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProfileContainer } from '@/components/profile';
import AppLayout from '@/components/layout/app-layout';

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
    <AppLayout userType="admin">
        <ProfileContainer
        userId={params.id}
        userType="admin"
        onNavigateBack={handleGoBack}
        wrapperClassName=""
        />
    </AppLayout>
  );
}