import {
  WorkspacePlan,
  WorkspaceStatus,
} from "../../graphql-types/globalTypes";
import { WorkspaceData } from "./data-types";

export const WORKSPACE_DATA: WorkspaceData = {
  id: "d0dbc712-8fb8-4b27-bad9-85de7cea5c86",
  slug: "full-user-workspace",
  name: "Full user workspace",
  plan: WorkspacePlan.Community,
  status: WorkspaceStatus.Active,
  image: "https://labelflow.ai/static/icon-512x512.png",
};

export const UNPAID_WORKSPACE_DATA: WorkspaceData = {
  id: "a6692e18-d508-4641-a7bb-6de18e74492c",
  slug: "unpaid-workspace",
  name: "Unpaid workspace",
  plan: WorkspacePlan.Pro,
  status: WorkspaceStatus.Unpaid,
  image: null,
};
