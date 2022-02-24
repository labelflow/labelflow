import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PRODUCTION } from "./constants";

const ENV_FILE_SUFFIX = PRODUCTION ? "production" : "development";

const CONFIG_MODULE = ConfigModule.forRoot({
  envFilePath: [".env.development.local", `.env.${ENV_FILE_SUFFIX}`],
  cache: true,
});

const EXTERNAL_MODULES = [CONFIG_MODULE];

// const PROJECT_MODULES = [];

@Module({
  imports: [...EXTERNAL_MODULES],
  // imports: [...EXTERNAL_MODULES, ...PROJECT_MODULES],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
