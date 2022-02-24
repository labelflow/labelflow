import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  private readonly logger = new Logger();

  constructor(private readonly appService: AppService) {}

  @EventPattern({ cmd: "send-invitation" })
  async invitationSent(@Payload() data: Record<string, unknown>) {
    console.log(data);
    this.logger.log(data);
  }
}
