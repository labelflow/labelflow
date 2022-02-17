/* eslint-disable max-classes-per-file */
import { Field, InputType, PickType } from "@nestjs/graphql";
import { Workspace } from "../../model/entities";

@InputType()
export class WorkspaceCreateInput extends PickType(
  Workspace,
  ["name", "image"],
  InputType
) {}

@InputType()
export class WorkspaceCreateOptions {
  @Field({ nullable: true })
  createTutorial?: boolean;
}
