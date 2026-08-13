import { useQuery } from '@tanstack/react-query';
import { apiRequest } from './api';
import { UserStats, CoursePath, LeaderboardEntry, Quest, Achievement } from '../types/api';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => apiRequest<UserStats>('/stats'),
  });
}

export function useCoursePath(courseId: number = 1) {
  return useQuery({
    queryKey: ['coursePath', courseId],
    queryFn: () => apiRequest<CoursePath>(`/courses/${courseId}/path`),
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => apiRequest<LeaderboardEntry[]>('/leaderboard'),
  });
}

export function useQuests() {
  return useQuery({
    queryKey: ['quests'],
    queryFn: () => apiRequest<Quest[]>('/quests'),
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: () => apiRequest<Achievement[]>('/achievements'),
  });
}
