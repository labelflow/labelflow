/* eslint-disable max-classes-per-file */
import { Field, ID, InputType, PickType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import { Image } from "../../model";

@InputType()
export class ImageWhereUniqueInput extends PickType(
  Image,
  ["id"] as const,
  InputType
) {}

@InputType()
export class ImageWhereInput {
  @Field(() => ID)
  @IsUUID()
  datasetId!: string;
}
