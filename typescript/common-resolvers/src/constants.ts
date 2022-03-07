import { WorkspacePlan } from "@labelflow/graphql-types";

/**
 * Maximum number of images per workspace depending on its plan
 */
export const MAX_IMAGES_PER_WORKSPACE: Record<WorkspacePlan, number> = {
  Community: 1000,
  Starter: 5000,
  Pro: 50000,
};
