/* eslint-disable max-classes-per-file */
import { Field, ID, InputType, PickType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
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
  @IsUUID()
  datasetId!: string;

  @Field(() => ID)
  @IsUUID()
  imageId!: string;

  @Field(() => ID)
  @IsUUID()
  labelClassId!: string;
}
