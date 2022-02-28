import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PRODUCTION } from "./constants";
import { TaskModule } from "./task/task.module";

const ENV_FILE_SUFFIX = PRODUCTION
  ? "production"
  : process.env.NODE_ENV || "development";

const CONFIG_MODULE = ConfigModule.forRoot({
  envFilePath: [".env.development.local", `.env.${ENV_FILE_SUFFIX}`],
  cache: true,
});

const EXTERNAL_MODULES = [CONFIG_MODULE];

const PROJECT_MODULES = [TaskModule];

@Module({
  imports: [...EXTERNAL_MODULES, ...PROJECT_MODULES],
  controllers: [],
  providers: [],
})
export class AppModule {}
