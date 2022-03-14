import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { isEmpty, isNil } from "lodash/fp";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";
import { Geometry, Label, LabelType } from "../../model";
import { computeLabelBounds, LabelBounds } from "../../utils";
import { EntityService } from "../common";
import { DB_EVENTS_CHANNEL_KEY } from "../constants";
import { LabelCreateInput, LabelUpdateInput } from "../input";
import { ImageService } from "./image.service";

@Injectable()
export class LabelService extends EntityService<
  Label,
  LabelCreateInput,
  LabelUpdateInput
> {
  constructor(
    @InjectRepository(Label) repository: Repository<Label>,
    private readonly images: ImageService,
    @Inject(DB_EVENTS_CHANNEL_KEY) events: ClientProxy
  ) {
    super(Label, repository, events);
  }

  async create(input: LabelCreateInput): Promise<Label> {
    const createdAt = new Date().toISOString();
    const bounds = await this.computeBounds(input.geometry, input.imageId);
    const data = {
      type: LabelType.Polygon,
      id: isEmpty(input.id) ? uuid() : input.id,
      ...input,
      createdAt,
      updatedAt: createdAt,
      ...bounds,
    };
    return await super.create(data);
  }

  async updateById(id: string, input: LabelUpdateInput): Promise<void> {
    const bounds = await this.computeBoundsUpdate(id, input);
    const data = { ...input, ...bounds };
    return await super.updateById(id, data);
  }

  private async computeBoundsUpdate(
    id: string,
    { geometry }: LabelUpdateInput
  ): Promise<LabelBounds | undefined> {
    if (isNil(geometry)) return undefined;
    const { imageId } = await this.findById(id, { select: ["imageId"] });
    return await this.computeBounds(geometry, imageId);
  }

  private async computeBounds(
    geometry: Geometry,
    imageId: string
  ): Promise<LabelBounds | undefined> {
    const image = await this.images.findById(imageId, {
      select: ["width", "height"],
    });
    return computeLabelBounds(geometry, image);
  }
}
