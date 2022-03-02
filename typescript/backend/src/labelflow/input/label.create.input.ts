import {
  Field,
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from "@nestjs/graphql";
import { Label } from "../../model/entities";
import { GeometryInput } from "./geometry.input";

@InputType()
export class LabelCreateInput extends IntersectionType(
  PickType(
    Label,
    ["x", "y", "width", "height", "smartToolInput"] as const,
    InputType
  ),
  PartialType(PickType(Label, ["type", "id"], InputType))
) {
  @Field()
  imageId!: string;

  @Field({ nullable: true })
  labelClassId?: string;

  @Field()
  geometry!: GeometryInput;
}
