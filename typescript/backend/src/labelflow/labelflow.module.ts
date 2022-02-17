import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ModelModule } from "../model";
import { StripeModule } from "../stripe";
import * as SERVICES from "./services";

const SERVICES_CLASSES = Object.values(SERVICES);

@Module({
  imports: [ConfigModule, StripeModule, ModelModule],
  providers: [...SERVICES_CLASSES],
  exports: SERVICES_CLASSES,
})
export class LabelFlowModule {}
