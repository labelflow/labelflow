import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class LabelClassReorderInput {
  @Field(() => Int)
  index!: number;
}
