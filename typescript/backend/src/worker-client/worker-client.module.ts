import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { WorkerClientService } from "./worker-client.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "WORKER_SERVICE",
        transport: Transport.REDIS,
        options: {
          url: "redis://localhost:6379",
        },
      },
    ]),
  ],
  providers: [WorkerClientService],
  exports: [WorkerClientService],
})
export class WorkerClientModule {}
