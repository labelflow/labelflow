import { InputType, PickType } from "@nestjs/graphql";
import { Membership } from "../../model/entities";

@InputType()
export class MembershipUpdateInput extends PickType(
  Membership,
  ["role"] as const,
  InputType
) {}
