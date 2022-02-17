import { InputType, PartialType, PickType } from "@nestjs/graphql";
import { Workspace } from "../../model";

@InputType()
export class WorkspaceWhereUniqueInput extends PartialType(
  PickType(Workspace, ["id", "slug"] as const, InputType)
) {}
