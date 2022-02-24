import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

export type Task = {
  name: string;
  input: Record<string, unknown>;
};

@Injectable()
export class WorkerClientService {
  constructor(@Inject("WORKER_SERVICE") private readonly worker: ClientProxy) {}

  async run({ name, input }: Task): Promise<void> {
    const observable = this.worker.emit({ cmd: name }, JSON.stringify(input));
    await lastValueFrom(observable);
  }
}
