import { Inject, Injectable, NotImplementedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Image } from "../../model";
import { EntityService } from "../common";
import { DB_EVENTS_CHANNEL_KEY } from "../constants";
import { ImageCreateInput, ImageCreateManyInput } from "../input";
import { ImageProcessingService } from "./image-processing.service";

@Injectable()
export class ImageService extends EntityService<Image> {
  constructor(
    @InjectRepository(Image) repository: Repository<Image>,
    private readonly imageProcessing: ImageProcessingService,
    @Inject(DB_EVENTS_CHANNEL_KEY) events: ClientProxy
  ) {
    super(Image, repository, events);
  }

  async importAndCreate(
    input: ImageCreateInput,
    origin: string | undefined
  ): Promise<Image> {
    const image = await this.imageProcessing.importAndProcess(input, origin);
    return await this.create(image);
  }

  importAndCreateMany(
    { datasetId, images }: ImageCreateManyInput,
    origin: string | undefined
  ): Promise<Image[]> {
    return Promise.all(
      images.map((image) =>
        this.importAndCreate({ ...image, datasetId }, origin)
      )
    );
  }

  updateById(id: string, data: DeepPartial<Image>): Promise<void> {
    throw new NotImplementedException();
  }

  async deleteById(id: string): Promise<void> {
    await super.deleteById(id);
  }
}
