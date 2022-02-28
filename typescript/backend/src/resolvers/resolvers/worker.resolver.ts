import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { WorkerClientService } from "../../worker-client";

@Resolver()
export class TaskResolver {
  constructor(private readonly worker: WorkerClientService) {}

  @Mutation(() => Boolean)
  async startTask(@Args("task") task: Task): Promise<boolean> {
    await this.worker.startTask({
      id: "a10a9a70-b503-49a9-a4ef-df7dbdedad04",
      moduleId: "4a287d4e-c825-4663-8cb5-65efe3e49f10",
      functionName: "add",
      input: { a: { value: 1 }, b: { value: 2 } },
    });
    return true;
  }
}
