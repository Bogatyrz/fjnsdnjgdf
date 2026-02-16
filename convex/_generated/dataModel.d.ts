/* eslint-disable */
/**
 * Generated DataModel types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 */

import type {
  DataModelFromSchemaDefinition,
  DocumentByName,
  TableNamesInDataModel,
} from "convex/server";
import type { GenericId } from "convex/values";
import schema from "../schema.js";

type DataModel = DataModelFromSchemaDefinition<typeof schema>;

export type TableNames = TableNamesInDataModel<DataModel>;

export type Doc<TableName extends TableNames> = DocumentByName<
  DataModel,
  TableName
>;

export type Id<TableName extends TableNames | string> =
  TableName extends TableNames
    ? GenericId<TableName>
    : string;
