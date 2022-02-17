/* eslint-disable max-classes-per-file */
import { Field, ID, InputType, PickType } from "@nestjs/graphql";
import { Label } from "../../model";

@InputType()
export class LabelWhereUniqueInput extends PickType(
  Label,
  ["id"] as const,
  InputType
) {}

@InputType()
export class LabelWhereInput {
  @Field(() => ID)
  datasetId!: string;

  @Field(() => ID)
  imageId!: string;

  @Field(() => ID)
  labelClassId!: string;
}
