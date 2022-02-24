import { LogLevel, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PRODUCTION } from "./constants";

const LOGGER_DEBUG: LogLevel[] = PRODUCTION ? [] : ["debug", "verbose"];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", ...LOGGER_DEBUG],
  });
  const validationPipe = new ValidationPipe({
    transform: true,
    enableDebugMessages: !PRODUCTION,
  });
  app.useGlobalPipes(validationPipe);
  const config = app.get(ConfigService);
  const port = config.get("PORT") || 3100;
  await app.listen(port);
}

bootstrap();
