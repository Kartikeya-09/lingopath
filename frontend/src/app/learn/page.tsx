"use client";

import React from 'react';
import { useCoursePath } from '@/lib/hooks';
import { LearningPath } from '@/components/learning-path/LearningPath';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';

export default function LearnPage() {
  const { data: course, isLoading, error } = useCoursePath(1);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center p-8 space-y-12">
        <SkeletonLoader className="w-full max-w-[600px] h-32 rounded-2xl" />
        <div className="space-y-8 flex flex-col items-center">
          <SkeletonLoader className="w-20 h-20 rounded-full" />
          <SkeletonLoader className="w-20 h-20 rounded-full" />
          <SkeletonLoader className="w-20 h-20 rounded-full" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Oops! Couldn't load the learning path.</h2>
        <p className="text-gray-500">Please make sure the backend server is running and database is seeded.</p>
      </div>
    );
  }

  return <LearningPath course={course} />;
}
