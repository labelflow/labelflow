import { Field, InputType, PickType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { Dataset } from "../../model/entities";

@InputType()
export class DatasetCreateInput extends PickType(
  Dataset,
  ["name"] as const,
  InputType
) {
  @Field()
  @IsNotEmpty()
  workspaceSlug!: string;
}
