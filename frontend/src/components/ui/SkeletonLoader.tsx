import React from 'react';
import { cn } from '@/lib/cn';

interface SkeletonLoaderProps {
  className?: string;
}

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
  );
}
