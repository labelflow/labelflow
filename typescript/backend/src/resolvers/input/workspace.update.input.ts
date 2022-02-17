import { InputType, PartialType, PickType } from "@nestjs/graphql";
import { Workspace } from "../../model";

@InputType()
export class WorkspaceUpdateInput extends PartialType(
  PickType(Workspace, ["name", "image"] as const, InputType)
) {}
