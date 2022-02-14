import { Badge } from "@chakra-ui/react";
import { WorkspacePlan } from "../../graphql-types";

type WorkspacePlanStyle = {
  color: string;
  emoji: string;
};

const WORKSPACE_PLAN_STYLE: Record<WorkspacePlan, WorkspacePlanStyle> = {
  Community: { color: "gray.200", emoji: "🐠" },
  Starter: { color: "pink.200", emoji: "🐙" },
  Pro: { color: "cyan.200", emoji: "🐳" },
  Enterprise: { color: "green.200", emoji: "🏢" },
};

export type WorkspacePlanBadgeProps = {
  /** Workspace plan for which the badge has to be shown */
  plan: WorkspacePlan;
};

/** Shows the given workspace plan with an emoji in a pretty badge */
export const WorkspacePlanBadge = ({ plan }: WorkspacePlanBadgeProps) => {
  const { color, emoji } = WORKSPACE_PLAN_STYLE[plan];
  return <Badge bgColor={color} color="black">{`${emoji} ${plan}`}</Badge>;
};
