import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../model";
import { EntityService } from "../common";
import { DB_EVENTS_CHANNEL_KEY } from "../constants";

@Injectable()
export class UserService extends EntityService<User> {
  constructor(
    @InjectRepository(User) repository: Repository<User>,
    @Inject(DB_EVENTS_CHANNEL_KEY) events: ClientProxy
  ) {
    super(User, repository, events);
  }
}
