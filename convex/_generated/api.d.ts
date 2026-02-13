/* eslint-disable */
/**
 * Generated `api` utility types.
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 */
export declare const api: FilterApi<
  ApiFromModules<{
    tasks: typeof import("../tasks");
    columns: typeof import("../columns");
    analytics: typeof import("../analytics");
    seed: typeof import("../seed");
  }>,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  ApiFromModules<{}>,
  FunctionReference<any, "internal">
>;
