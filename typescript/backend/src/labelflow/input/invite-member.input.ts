import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty } from "class-validator";
import { MembershipRole } from "../../model";

@InputType()
export class InviteMemberInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field(() => MembershipRole)
  role!: MembershipRole;

  @Field()
  @IsNotEmpty()
  workspaceSlug!: string;
}
