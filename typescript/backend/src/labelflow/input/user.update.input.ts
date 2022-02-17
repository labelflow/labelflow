import { InputType, PickType } from "@nestjs/graphql";
import { User } from "../../model/entities";

@InputType()
export class UserUpdateInput extends PickType(
  User,
  ["name", "image"] as const,
  InputType
) {}
