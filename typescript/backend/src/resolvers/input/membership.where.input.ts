/* eslint-disable max-classes-per-file */
import { Field, InputType, PickType } from "@nestjs/graphql";
import { Membership } from "../../model";

@InputType()
export class MembershipWhereUniqueInput extends PickType(
  Membership,
  ["id"] as const,
  InputType
) {}

@InputType()
export class MembershipWhereInput {
  @Field()
  workspaceSlug!: string;
}
