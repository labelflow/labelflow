import { Field, InputType, Int } from "@nestjs/graphql";
import { Min } from "class-validator";

@InputType()
export class LabelClassReorderInput {
  @Field(() => Int)
  @Min(0)
  index!: number;
}
