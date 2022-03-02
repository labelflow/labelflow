import { Module } from "@nestjs/common";
import { LabelFlowModule } from "../labelflow";
import { ModelModule } from "../model";
import * as RESOLVERS from "./resolvers";

const RESOLVERS_CLASSES = Object.values(RESOLVERS);

@Module({
  imports: [LabelFlowModule, ModelModule],
  providers: [...RESOLVERS_CLASSES],
})
export class ResolversModule {}
