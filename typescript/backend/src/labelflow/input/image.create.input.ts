import { Field, ID, InputType, PartialType, PickType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import { Image } from "../../model/entities";

@InputType()
export class ImageCreateInput extends PartialType(
  PickType(
    Image,
    [
      "id",
      "createdAt",
      "name",
      "path",
      "mimetype",
      "width",
      "height",
      "url",
      "externalUrl",
      "thumbnail20Url",
      "thumbnail50Url",
      "thumbnail100Url",
      "thumbnail200Url",
      "thumbnail500Url",
      "metadata",
    ] as const,
    InputType
  )
) {
  @Field(() => ID)
  @IsUUID()
  datasetId!: string;

  @Field({ nullable: true })
  noThumbnails?: boolean;
}
