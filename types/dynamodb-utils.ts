/**
 * DynamoDB Utility Types
 *
 * Types for DynamoDB expression builders and operations.
 */

import { NativeAttributeValue } from "@aws-sdk/util-dynamodb";

/**
 * Type for DynamoDB ExpressionAttributeValues
 * Used in Query, Scan, Update operations
 */
export type ExpressionAttributeValues = Record<string, NativeAttributeValue>;

/**
 * Type for DynamoDB ExpressionAttributeNames
 * Maps placeholder names to actual attribute names
 */
export type ExpressionAttributeNames = Record<string, string>;

/**
 * Generic update input for DynamoDB items
 */
export interface DynamoDBUpdateInput<T> {
  key: Partial<T>;
  updates: Partial<T>;
}
