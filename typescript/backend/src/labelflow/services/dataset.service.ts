import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getSlug } from "labelflow-utils";
import { Repository } from "typeorm";
import { Dataset } from "../../model";
import { EntityService } from "../common";
import { DatasetCreateInput, DatasetUpdateInput } from "../input";

@Injectable()
export class DatasetService extends EntityService<
  Dataset,
  DatasetCreateInput & Pick<Dataset, "slug">,
  DatasetUpdateInput
> {
  constructor(@InjectRepository(Dataset) repository: Repository<Dataset>) {
    super(Dataset, repository);
  }

  create(input: DatasetCreateInput): Promise<Dataset> {
    return super.create({ ...input, slug: getSlug(input.name) });
  }
}
