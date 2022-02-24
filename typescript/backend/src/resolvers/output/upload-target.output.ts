import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType("UploadTargetHttp")
export class UploadTarget {
  @Field()
  uploadUrl!: string;

  @Field()
  downloadUrl!: string;
}
