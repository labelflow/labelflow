import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { getSlug } from "labelflow-utils";
import { Repository, UpdateResult } from "typeorm";
import { Dataset } from "../../model";
import { EntityService } from "../common";
import { DB_EVENTS_CHANNEL_KEY } from "../constants";
import { DatasetCreateInput, DatasetUpdateInput } from "../input";

@Injectable()
export class DatasetService extends EntityService<
  Dataset,
  DatasetCreateInput & Pick<Dataset, "slug">,
  DatasetUpdateInput
> {
  constructor(
    @InjectRepository(Dataset) private repository: Repository<Dataset>,
    @Inject(DB_EVENTS_CHANNEL_KEY) events: ClientProxy
  ) {
    super(Dataset, repository, events);
  }

  create(input: DatasetCreateInput): Promise<Dataset> {
    return super.create({ ...input, slug: getSlug(input.name) });
  }

  updateBySlugs(
    workspaceSlug: string,
    datasetSlug: string,
    input: DatasetUpdateInput
  ): Promise<UpdateResult> {
    return this.repository.update({ workspaceSlug, slug: datasetSlug }, input);
  }

  async deleteBySlugs(
    workspaceSlug: string,
    datasetSlug: string
  ): Promise<void> {
    await this.repository.delete({ workspaceSlug, slug: datasetSlug });
  }
}
