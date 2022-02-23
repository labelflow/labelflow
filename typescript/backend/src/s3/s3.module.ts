import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";

@Module({
  imports: [HttpModule],
  providers: [S3Service],
})
export class S3Module {}
