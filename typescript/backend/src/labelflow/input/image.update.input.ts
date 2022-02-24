import { InputType, PartialType, PickType } from "@nestjs/graphql";
import { Image } from "../../model/entities";

@InputType()
export class ImageUpdateInput extends PartialType(
  PickType(
    Image,
    [
      "thumbnail20Url",
      "thumbnail50Url",
      "thumbnail100Url",
      "thumbnail200Url",
      "thumbnail500Url",
    ] as const,
    InputType
  )
) {}
