"use client";

import { useCallback } from "react";

// Mock seed functions for static export
export function useSeedDatabase() {
  return useCallback(async () => {
    // In a real app, this would seed the Convex database
    // For static export, the mock data is already loaded
    console.log("Database seeded (mock)");
    return { success: true, message: "Database seeded successfully!" };
  }, []);
}

export function useClearDatabase() {
  return useCallback(async () => {
    // In a real app, this would clear the Convex database
    console.log("Database cleared (mock)");
    return { success: true, message: "Database cleared successfully!" };
  }, []);
}
