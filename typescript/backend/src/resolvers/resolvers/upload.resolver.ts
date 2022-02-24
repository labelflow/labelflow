import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { S3Service } from "../../s3";
import { UploadTargetInput } from "../input";
import { UploadTarget } from "../output";

@Resolver()
export class UploadResolver {
  constructor(private readonly s3: S3Service) {}

  @Mutation(() => UploadTarget)
  async getUploadTarget(
    @Args("data") { key }: UploadTargetInput,
    @Context() { req }: GraphQlContext
  ): Promise<UploadTarget> {
    const uploadUrl = await this.s3.getSignedUploadUrl(key);
    const downloadUrl = `${req.headers.origin}/api/downloads/${key}`;
    return { uploadUrl, downloadUrl };
  }
}
