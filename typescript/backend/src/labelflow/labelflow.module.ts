import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ModelModule } from "../model";
import { S3Module } from "../s3";
import { StripeModule } from "../stripe";
import { WorkerClientModule } from "../worker-client";
import * as SERVICES from "./services";

const SERVICES_CLASSES = Object.values(SERVICES);

@Module({
  imports: [
    ConfigModule,
    StripeModule,
    ModelModule,
    HttpModule,
    S3Module,
    WorkerClientModule,
  ],
  providers: [...SERVICES_CLASSES],
  exports: SERVICES_CLASSES,
})
export class LabelFlowModule {}
