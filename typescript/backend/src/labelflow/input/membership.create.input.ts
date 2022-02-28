import {
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from "@nestjs/graphql";
import { Membership } from "../../model/entities";

@InputType()
export class MembershipCreateInput extends IntersectionType(
  PickType(Membership, ["role", "userId", "workspaceSlug"] as const, InputType),
  PartialType(PickType(Membership, ["id"] as const, InputType))
) {}
