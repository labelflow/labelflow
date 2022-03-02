import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Membership } from "../../model";
import { EntityService } from "../common";

@Injectable()
export class MembershipService extends EntityService<Membership> {
  constructor(
    @InjectRepository(Membership) repository: Repository<Membership>
  ) {
    super(Membership, repository);
  }
}
