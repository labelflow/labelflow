import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join as joinPath } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth";
import { PRODUCTION } from "./constants";
import { DataLoaderModule, DataLoaderService } from "./data-loader";
import { GraphQlLogger } from "./graphql-logger";
import { LabelFlowModule } from "./labelflow";
import { ModelModule } from "./model";
import { ResolversModule } from "./resolvers";
import { S3Module } from "./s3";
import { StripeModule } from "./stripe";
import { WorkerClientModule } from "./worker-client";

const ENV_FILE_SUFFIX = PRODUCTION
  ? "production"
  : process.env.NODE_ENV || "development";

const CONFIG_MODULE = ConfigModule.forRoot({
  envFilePath: [".env.local", `.env.${ENV_FILE_SUFFIX}`],
  cache: true,
});

const THROTTLER_MODULE = ThrottlerModule.forRoot({
  ttl: 60,
  limit: 10,
});

const TYPEORM_MODULE = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: "postgres",
    host: config.get("POSTGRES_HOST"),
    port: config.get("POSTGRES_PORT"),
    username: config.get("POSTGRES_ADMIN_USER"),
    password: config.get("POSTGRES_ADMIN_PASSWORD"),
    database:
      config.get("NODE_ENV") === "test"
        ? config.get("POSTGRES_DB_TEST")
        : config.get("POSTGRES_DB"),
    entities: [],
    // synchronize: !PRODUCTION,
    autoLoadEntities: true,
    logging: !PRODUCTION,
  }),
});

const GRAPHQL_MODULE = GraphQLModule.forRootAsync<ApolloDriverConfig>({
  driver: ApolloDriver,
  imports: [DataLoaderModule],
  inject: [DataLoaderService],
  useFactory: (dataloaderService: DataLoaderService) => ({
    debug: !PRODUCTION,
    logger: new GraphQlLogger(GraphQLModule.name),
    playground: !PRODUCTION,
    autoSchemaFile: joinPath(process.cwd(), "src/schema.gql"),
    sortSchema: true,
    context: () => ({
      loaders: dataloaderService.createLoaders(),
    }),
  }),
});

const EXTERNAL_MODULES = [
  CONFIG_MODULE,
  THROTTLER_MODULE,
  TYPEORM_MODULE,
  GRAPHQL_MODULE,
];

const PROJECT_MODULES = [
  AuthModule,
  LabelFlowModule,
  ModelModule,
  ResolversModule,
  S3Module,
  StripeModule,
  WorkerClientModule,
];

@Module({
  imports: [...EXTERNAL_MODULES, ...PROJECT_MODULES],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
