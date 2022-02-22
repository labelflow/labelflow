import { Badge } from "@chakra-ui/react";
import { WorkspacePlan } from "@labelflow/graphql-types";

type WorkspacePlanStyle = {
  color: string;
  emoji: string;
};

const WORKSPACE_PLAN_STYLE: Record<WorkspacePlan, WorkspacePlanStyle> = {
  Community: { color: "gray.200", emoji: "🐠" },
  Starter: { color: "pink.200", emoji: "🐙" },
  Pro: { color: "cyan.200", emoji: "🐳" },
};

export const WorkspacePlanBadge = ({ plan }: { plan: WorkspacePlan }) => {
  const { color, emoji } = WORKSPACE_PLAN_STYLE[plan];
  return <Badge bgColor={color} color="black">{`${emoji} ${plan}`}</Badge>;
};
