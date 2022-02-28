import { InputType, PartialType, PickType } from "@nestjs/graphql";
import { Workspace } from "../../model/entities";

@InputType()
export class WorkspaceUpdateInput extends PartialType(
  PickType(Workspace, ["name", "image"], InputType)
) {}
