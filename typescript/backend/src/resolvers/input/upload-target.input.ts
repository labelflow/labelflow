import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UploadTargetInput {
  @Field()
  key!: string;
}
