import {
  Field,
  ID,
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from "@nestjs/graphql";
import { LabelClass } from "../../model/entities";

@InputType()
export class LabelClassCreateInput extends IntersectionType(
  PickType(LabelClass, ["name", "color"] as const, InputType),
  PartialType(PickType(LabelClass, ["id"] as const, InputType))
) {
  @Field(() => ID)
  datasetId!: string;
}
