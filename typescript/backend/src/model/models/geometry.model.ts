import { Field, ObjectType } from "@nestjs/graphql";
import GqlJSON from "graphql-type-json";
import { GeometryType } from "../enums";

@ObjectType()
export class Geometry {
  @Field(() => GeometryType)
  type!: string;

  @Field(() => GqlJSON)
  coordinates!: number[][][] | number[][][][];
}
