import { Logger as NestLogger } from "@nestjs/common";

export class GraphQlLogger {
  private readonly logger: NestLogger;

  constructor(name: string) {
    this.logger = new NestLogger(name);
    this.logger.verbose("GraphQlLogger initialized");
  }

  debug(message?: unknown) {
    this.logger.debug(message);
  }

  info(message?: unknown) {
    this.logger.log(message);
  }

  warn(message?: unknown) {
    this.logger.warn(message);
  }

  error(message?: unknown) {
    this.logger.error(message);
  }
}
