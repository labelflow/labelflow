import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { TaskCreateInput, TaskService } from "../../labelflow";
import { Task } from "../../model";
import { WorkerClientService } from "../../worker-client";

@Resolver()
export class TaskResolver {
  constructor(
    private readonly service: TaskService,
    private readonly worker: WorkerClientService
  ) {}

  @Mutation(() => Task)
  async startTask(@Args("task") input: TaskCreateInput): Promise<Task> {
    const task = await this.service.create(input);
    await this.worker.startTask(task);
    return task;
  }
}
