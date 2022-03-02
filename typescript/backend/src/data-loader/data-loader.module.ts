import { Module } from "@nestjs/common";
import { LabelFlowModule } from "../labelflow";
import { DataLoaderService } from "./data-loader.service";

@Module({
  providers: [DataLoaderService],
  imports: [LabelFlowModule],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}
