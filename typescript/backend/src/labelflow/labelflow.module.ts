import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ModelModule } from "../model";
import { S3Module } from "../s3";
import { StripeModule } from "../stripe";
import { WorkerClientModule } from "../worker-client";
import { DB_EVENTS_CHANNEL_KEY } from "./constants";
import * as SERVICES from "./services";

const REDIS_CLIENT_MODULE = ClientsModule.register([
  {
    name: DB_EVENTS_CHANNEL_KEY,
    transport: Transport.REDIS,
    options: { url: "redis://localhost:6379" },
  },
]);

const SERVICES_CLASSES = Object.values(SERVICES);

@Module({
  imports: [
    ConfigModule,
    StripeModule,
    ModelModule,
    HttpModule,
    S3Module,
    WorkerClientModule,
    REDIS_CLIENT_MODULE,
  ],
  providers: [...SERVICES_CLASSES],
  exports: SERVICES_CLASSES,
})
export class LabelFlowModule {}
