import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UploadTargetInput {
  @Field()
  @IsNotEmpty()
  key!: string;
}
