import { InputType, PartialType, PickType } from "@nestjs/graphql";
import { LabelClass } from "../../model/entities";

@InputType()
export class LabelClassUpdateInput extends PartialType(
  PickType(LabelClass, ["name", "color"] as const, InputType)
) {}
