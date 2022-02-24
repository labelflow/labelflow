import { Field, InputType } from "@nestjs/graphql";
import { MembershipRole } from "../../model";

@InputType()
export class InviteMemberInput {
  @Field()
  email!: string;

  @Field(() => MembershipRole)
  role!: MembershipRole;

  @Field()
  workspaceSlug!: string;
}
