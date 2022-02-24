import { Module } from "@nestjs/common";
import { LabelFlowModule } from "../labelflow";
import { ModelModule } from "../model";
import { S3Module } from "../s3";
import { WorkerClientModule } from "../worker-client";
import * as RESOLVERS from "./resolvers";

const RESOLVERS_CLASSES = Object.values(RESOLVERS);

@Module({
  imports: [LabelFlowModule, ModelModule, S3Module, WorkerClientModule],
  providers: [...RESOLVERS_CLASSES],
})
export class ResolversModule {}
