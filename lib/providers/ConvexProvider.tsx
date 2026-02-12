"use client";

import { ReactNode } from "react";

interface ConvexProviderProps {
  children: ReactNode;
}

export function ConvexProvider({ children }: ConvexProviderProps) {
  // For static export and development without Convex setup,
  // we render children directly. In production with Convex,
  // this would wrap with ConvexProvider from "convex/react"
  return <>{children}</>;
}
