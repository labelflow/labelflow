import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as ENTITIES from "./entities";

const ENTITIES_CLASSES = Object.values(ENTITIES);

const REPOSITORIES = TypeOrmModule.forFeature(ENTITIES_CLASSES);

@Module({
  imports: [REPOSITORIES],
  exports: [REPOSITORIES],
})
export class ModelModule {}
