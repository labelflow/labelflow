import { InputType, PickType } from "@nestjs/graphql";
import { User } from "../../model";

@InputType()
export class UserWhereUniqueInput extends PickType(
  User,
  ["id"] as const,
  InputType
) {}
