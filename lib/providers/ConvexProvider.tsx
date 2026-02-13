"use client";

import { ReactNode } from "react";

// Mock ConvexProvider for static export
// In production with Convex backend, this would use the real ConvexProvider

interface ConvexProviderProps {
  children: ReactNode;
}

export function ConvexClientProvider({ children }: ConvexProviderProps) {
  // For static export, we don't need a real Convex client
  // The hooks use local state management instead
  return <>{children}</>;
}
