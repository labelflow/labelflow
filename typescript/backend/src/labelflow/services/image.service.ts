import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Image } from "../../model";
import { EntityService } from "../common";

@Injectable()
export class ImageService extends EntityService<Image> {
  constructor(@InjectRepository(Image) repository: Repository<Image>) {
    super(Image, repository);
  }
}
