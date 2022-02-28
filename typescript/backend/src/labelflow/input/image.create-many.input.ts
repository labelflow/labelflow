/* eslint-disable max-classes-per-file */
import { Field, InputType, OmitType, PickType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { ImageCreateInput } from "./image.create.input";

@InputType()
export class ImageCreateManySingleInput extends OmitType(ImageCreateInput, [
  "datasetId",
] as const) {}

@InputType()
export class ImageCreateManyInput extends PickType(ImageCreateInput, [
  "datasetId",
] as const) {
  @Field(() => [ImageCreateManySingleInput])
  @IsNotEmpty()
  images!: ImageCreateManySingleInput[];
}
