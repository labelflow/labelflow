import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { RedisEvent, Task } from "labelflow-core";
import { isEmpty } from "lodash/fp";
import { TaskService } from "./task.service";

@Controller("task")
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) {}

  @EventPattern({ cmd: RedisEvent.ExecuteTask })
  async executeTask(@Payload() task: Task) {
    const { id, name } = task;
    const nameText = isEmpty(name) ? "" : ` (${name})`;
    this.logger.log(`Executing task ${id}${nameText}...`);
    this.logger.verbose(task);
    const result = await this.taskService.execute(task);
    this.logger.log(`Finished task ${id}${nameText}`);
    this.logger.verbose({ result });
  }
}
