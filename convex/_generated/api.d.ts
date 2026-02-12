/* eslint-disable */
/**
 * Generated `api` utility types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  ApiFromModules<{}>,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  ApiFromModules<{}>,
  FunctionReference<any, "internal">
>;
