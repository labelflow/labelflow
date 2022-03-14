import { InputType, OmitType } from "@nestjs/graphql";
import { Task } from "../../model/entities";

@InputType()
export class TaskCreateInput extends OmitType(
  Task,
  ["id", "status"] as const,
  InputType
) {}
