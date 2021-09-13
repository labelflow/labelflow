import { WorkspaceType } from "@labelflow/graphql-types";
import { WorkspacePlan } from "@prisma/client";

export const localWorkspace = {
  id: "2df392a2-7234-4767-82f3-85daff3d94dc",
  createdAt: "1970-01-01T00:00:00.000Z",
  updatedAt: "1970-01-01T00:00:00.000Z",
  name: "Local",
  slug: "local",
  type: WorkspaceType.Local,
  plan: WorkspacePlan.Community,
};

const workspace = () => localWorkspace;
const workspaces = () => [localWorkspace];

const datasets = () => [];

export default {
  Query: {
    workspace,
    workspaces,
  },

  Mutation: {},
  Workspace: { datasets },
};
