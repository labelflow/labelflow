import {
  Field,
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from "@nestjs/graphql";
import { IsOptional, IsUUID } from "class-validator";
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
  @IsUUID()
  imageId!: string;

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  labelClassId?: string;

  @Field()
  geometry!: GeometryInput;
}
