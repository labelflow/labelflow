import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../../model";
import { EntityService } from "../common";
import { DB_EVENTS_CHANNEL_KEY } from "../constants";
import { TaskCreateInput } from "../input";

@Injectable()
export class TaskService extends EntityService<Task, TaskCreateInput> {
  constructor(
    @InjectRepository(Task) repository: Repository<Task>,
    @Inject(DB_EVENTS_CHANNEL_KEY) events: ClientProxy
  ) {
    super(Task, repository, events);
  }
}
