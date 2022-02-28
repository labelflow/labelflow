import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { RedisEvent, Task } from "labelflow-core";
import { isEmpty } from "lodash/fp";
import { WORKER_MICROSERVICE_KEY } from "./constants";

@Injectable()
export class WorkerClientService {
  private readonly logger = new Logger();

  constructor(
    @Inject(WORKER_MICROSERVICE_KEY) private readonly worker: ClientProxy
  ) {
    console.log(WorkerClientService.name);
  }

  async startTask(task: Task): Promise<void> {
    const { name, id } = task;
    const nameText = isEmpty(name) ? "" : ` (${name})`;
    this.logger.verbose(`Starting task ${id}${nameText}...`, task);
    const observable = this.worker.emit({ cmd: RedisEvent.ExecuteTask }, task);
    await lastValueFrom(observable);
  }
}
