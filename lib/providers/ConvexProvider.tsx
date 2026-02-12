"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

// Create client only if URL is available
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

interface ConvexProviderProps {
  children: ReactNode;
}

export function ConvexClientProvider({ children }: ConvexProviderProps) {
  // If no Convex URL, render children without provider (for static export)
  if (!convex) {
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
