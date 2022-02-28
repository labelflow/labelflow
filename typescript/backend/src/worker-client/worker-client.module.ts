import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { WORKER_MICROSERVICE_KEY } from "./constants";
import { WorkerClientService } from "./worker-client.service";

const REDIS_CLIENT_MODULE = ClientsModule.register([
  {
    name: WORKER_MICROSERVICE_KEY,
    transport: Transport.REDIS,
    options: { url: "redis://localhost:6379" },
  },
]);

@Module({
  imports: [REDIS_CLIENT_MODULE],
  providers: [WorkerClientService],
  exports: [WorkerClientService],
})
export class WorkerClientModule {}
