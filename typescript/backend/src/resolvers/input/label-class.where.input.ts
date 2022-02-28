/* eslint-disable max-classes-per-file */
import { Field, ID, InputType, PickType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import { LabelClass } from "../../model";

@InputType()
export class LabelClassWhereUniqueInput extends PickType(
  LabelClass,
  ["id"] as const,
  InputType
) {}

@InputType()
export class LabelClassWhereInput extends PickType(
  LabelClass,
  ["name"] as const,
  InputType
) {
  @Field(() => ID)
  @IsUUID()
  datasetId!: string;
}
