import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../model";
import { EntityService } from "../common";

@Injectable()
export class UserService extends EntityService<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(User, repository);
  }
}
