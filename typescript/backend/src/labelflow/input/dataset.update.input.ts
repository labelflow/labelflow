import { InputType, PickType } from "@nestjs/graphql";
import { Dataset } from "../../model/entities";

@InputType()
export class DatasetUpdateInput extends PickType(
  Dataset,
  ["name"] as const,
  InputType
) {}
