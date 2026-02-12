"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Query hooks
export function useAllAnalytics() {
  return useQuery(api.analytics.getAll);
}

export function useAnalyticsByDateRange(startDate: string, endDate: string) {
  return useQuery(api.analytics.getByDateRange, { startDate, endDate });
}

export function useTodayAnalytics() {
  return useQuery(api.analytics.getToday);
}

export function useDashboardStats() {
  return useQuery(api.analytics.getDashboardStats);
}

export function useWeeklyData() {
  return useQuery(api.analytics.getWeeklyData);
}

export function usePriorityDistribution() {
  return useQuery(api.analytics.getPriorityDistribution);
}

export function useStatusDistribution() {
  return useQuery(api.analytics.getStatusDistribution);
}

export function useTeamStats() {
  return useQuery(api.analytics.getTeamStats);
}

export function useCompletionStats() {
  return useQuery(api.analytics.getCompletionStats);
}
