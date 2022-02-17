import { InputType, PickType } from "@nestjs/graphql";
import { Dataset } from "../../model/entities";

@InputType()
export class DatasetCreateInput extends PickType(
  Dataset,
  ["name", "workspaceSlug"] as const,
  InputType
) {}
