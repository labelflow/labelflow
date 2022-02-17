/* eslint-disable max-classes-per-file */
import { Field, InputType, PartialType, PickType } from "@nestjs/graphql";
import { Dataset } from "../../model";

@InputType()
export class DatasetWhereIdInput extends PickType(
  Dataset,
  ["id"] as const,
  InputType
) {}

@InputType()
export class WorkspaceSlugAndDatasetSlug extends PickType(
  Dataset,
  ["slug"] as const,
  InputType
) {
  @Field()
  workspaceSlug!: string;
}

@InputType()
export class DatasetWhereUniqueInput extends PartialType(
  PickType(Dataset, ["id"] as const, InputType)
) {
  @Field(() => WorkspaceSlugAndDatasetSlug, { nullable: true })
  slugs?: WorkspaceSlugAndDatasetSlug;
}

@InputType()
export class DatasetWhereInput {
  @Field()
  workspaceSlug!: string;
}
