/* eslint-disable max-classes-per-file */
import {
  Field,
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from "@nestjs/graphql";
import { Workspace } from "../../model/entities";

@InputType()
export class WorkspaceCreateInput extends IntersectionType(
  PickType(Workspace, ["name", "image"], InputType),
  PartialType(PickType(Workspace, ["plan"], InputType))
) {}

@InputType()
export class WorkspaceCreateOptions {
  @Field({ nullable: true })
  createTutorial?: boolean;
}
