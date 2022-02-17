import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Min } from "class-validator";

@ObjectType()
export class TotalCountAggregates {
  @Field(() => Int)
  @Min(0)
  totalCount!: number;
}
