import { InputType, PartialType } from "@nestjs/graphql";
import { LabelCreateInput } from "./label.create.input";

@InputType()
export class LabelUpdateInput extends PartialType(LabelCreateInput) {}
