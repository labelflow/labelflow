import { Logger, LogLevel, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { RedisOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { PRODUCTION } from "./constants";

const LOGGER_DEBUG: LogLevel[] = PRODUCTION ? [] : ["debug", "verbose"];

const logger = new Logger("Main");

async function bootstrap() {
  // const config = app.get(ConfigService);
  // const serverUrl = config.get("REDIS_URL") || "redis://localhost:6379";
  const serverUrl = "redis://localhost:6379";
  const app = await NestFactory.createMicroservice<RedisOptions>(AppModule, {
    transport: Transport.REDIS,
    options: { url: serverUrl },
    // logger: ["error", "warn", ...LOGGER_DEBUG],
  });
  const validationPipe = new ValidationPipe({
    transform: true,
    enableDebugMessages: !PRODUCTION,
  });
  app.useGlobalPipes(validationPipe);
  logger.log(`Listening to ${serverUrl}`);
  app.listen();
}

bootstrap();
