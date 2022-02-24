import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  Injectable,
  Logger,
  NotImplementedException,
} from "@nestjs/common";
import { Blob } from "buffer";
import Jimp from "jimp/es";
import { isEmpty, isNil } from "lodash/fp";
import mime from "mime-types";
import { lastValueFrom } from "rxjs";
import { AsyncReturnType, SetOptional, SetRequired } from "type-fest";
import { v4 as uuid } from "uuid";
import { Image } from "../../model";
import { S3Service } from "../../s3";
import { getThumbnailUrlFromImageUrl, ImageUrlInfo } from "../../utils";
import { ImageCreateInput } from "../input";
import { DatasetService } from "./dataset.service";
import { WorkspaceService } from "./workspace.service";

type JimpImage = AsyncReturnType<typeof Jimp.read>;

type ThumbnailSizes = 20 | 50 | 100 | 200 | 500;

const DEFAULT_MAX_IMAGE_SIZE_PX: number = 60e6;

const MAX_IMAGE_SIZES_PX: { [mimetype: string]: number } = {
  "image/jpeg": 100e6,
  "image/png": 60e6,
};

const DOWNLOAD_IMAGE_ACCEPT_HEADER =
  "image/tiff,image/jpeg,image/png,application/zip,image/*,*/*;q=0.8";

@Injectable()
export class ImageProcessingService {
  private logger = new Logger(ImageProcessingService.name);

  constructor(
    private readonly workspaces: WorkspaceService,
    private readonly datasets: DatasetService,
    private readonly http: HttpService,
    private readonly s3: S3Service
  ) {}

  async importAndProcess(
    { id = uuid(), ...input }: ImageCreateInput,
    origin: string | undefined
  ): Promise<Image> {
    const withId = { id, ...input };
    this.logger.verbose("Starting importAndProcess...", { input: withId });
    const finalUrl = await this.importImageIfNeeded(withId, origin);
    const withFinalUrl = { ...withId, url: finalUrl };
    const extraInfo = await this.processImage(withFinalUrl, origin);
    const finalName = this.getImageName(withFinalUrl);
    const { externalUrl, path } = withFinalUrl;
    const finalPath = path ?? externalUrl ?? finalUrl;
    const now = withFinalUrl?.createdAt ?? new Date();
    const output = {
      ...withFinalUrl,
      ...extraInfo,
      name: finalName,
      path: finalPath,
      createdAt: now,
      updatedAt: now,
    };
    this.logger.verbose("Finished ImportAndProcess", { input: withId, output });
    return output;
  }

  private async importImageIfNeeded(
    input: SetRequired<ImageCreateInput, "id">,
    origin: string | undefined
  ): Promise<string> {
    this.validateInput(input);
    const { url, externalUrl } = input;
    if (!isNil(url)) {
      if (this.s3.isInternalUrl(url, origin)) return url;
      const msg = "Please use externalUrl if URL is not internal";
      throw new BadRequestException(msg);
    }
    if (!isNil(externalUrl)) {
      this.logger.verbose("Image has to be imported from an external URL");
      return await this.importFromExternalUrl(
        input as Required<Pick<typeof input, "externalUrl">> &
          Omit<typeof input, "externalUrl">,
        origin
      );
    }
    const msg = "Image must have either url or externalUrl";
    throw new BadRequestException(msg);
  }

  private validateInput(input: ImageCreateInput): void {
    const { url, externalUrl } = input;
    const urlIsValid = !isEmpty(url);
    const externalUrlIsValid = !isEmpty(externalUrl);
    const numberOfValidInputs = Number(externalUrlIsValid) + Number(urlIsValid);
    if (numberOfValidInputs === 1) return;
    throw new Error(
      "Image creation upload must include either a `file` field of type `Upload`, or a `url` field of type `String`, or a `externalUrl` field of type `String`"
    );
  }

  private async getImageFileKey({
    id,
    datasetId,
    mimetype,
  }: Required<Pick<Image, "id" | "datasetId" | "mimetype">>): Promise<string> {
    const { workspaceSlug } = await this.datasets.findById(datasetId, {
      select: ["workspaceSlug"],
    });
    const { id: workspaceId } = await this.workspaces.findOneOrFail({
      where: { slug: workspaceSlug },
      select: ["id"],
    });
    const mimeExtension = mime.extension(mimetype);
    const extension = mimeExtension || "bin";
    const output = `${workspaceId}/${datasetId}/${id}.${extension}`;
    this.logger.verbose("getImageFileKey", { id, datasetId, mimetype, output });
    return output;
  }

  private async importFromExternalUrl(
    input: Required<Pick<Image, "id" | "datasetId" | "externalUrl">>,
    origin: string | undefined
  ): Promise<string> {
    this.logger.verbose("Importing image from external URL...", input);
    const { id, datasetId, externalUrl } = input;
    const data = await this.downloadImage(externalUrl, origin);
    const buffer = Buffer.from(data);
    const blob = new Blob([buffer]);
    const key = await this.getImageFileKey({
      id,
      datasetId,
      mimetype: blob.type,
    });
    this.logger.verbose("Image downloaded locally, uploading...", {
      input,
      mimetype: blob.type,
      key,
    });
    await this.s3.upload(key, data);
    this.logger.verbose("importFromExternalUrl", {
      id,
      datasetId,
      externalUrl,
      key,
    });
    if (isNil(origin)) {
      throw new NotImplementedException();
    }
    return this.s3.getApiDownloadsUrl(origin, key);
  }

  private async downloadImage<TData = ArrayBuffer>(
    url: string,
    origin: string | undefined
  ): Promise<TData> {
    this.logger.verbose(`Downloading image from URL ${url}`);
    const downloadUrl = await this.bypassApiDownloads(url, origin);
    const observable = this.http.get(downloadUrl, {
      headers: {
        Accept: DOWNLOAD_IMAGE_ACCEPT_HEADER,
        "Sec-Fetch-Dest": "image",
      },
      responseType: "arraybuffer",
    });
    const response = await lastValueFrom(observable);
    this.logger.verbose("Image downloaded");
    if (response.status === 200) return response.data;
    throw new Error(`Failed to download image from URL ${url}`);
  }

  private async bypassApiDownloads(
    url: string,
    origin: string | undefined
  ): Promise<string> {
    if (!this.s3.isApiDownloadUrl(url, origin)) return url;
    const s3Key = this.s3.getKeyFromApiDownloads(url, origin);
    const output = await this.s3.getSignedDownloadUrl(s3Key);
    this.logger.verbose("Bypassing /api/downloads with the S3 bucket URL", {
      input: url,
      output,
    });
    return output;
  }

  private async processImage(
    input: SetRequired<ImageCreateInput, "url">,
    origin: string | undefined
  ): Promise<SetOptional<Image, "id" | "createdAt" | "name" | "path">> {
    const thumbnailsInput = this.prepareThumbnails(input);
    const { noThumbnails, ...withThumbnails } = {
      ...input,
      ...thumbnailsInput,
    };
    if (this.shouldNotLoadImage(withThumbnails)) {
      this.logger.verbose("No need to download and process image");
      return withThumbnails;
    }
    this.logger.verbose("Processing image...", {
      input: { ...withThumbnails },
      noThumbnails,
    });
    const { url } = withThumbnails;
    const downloadResponse = await this.downloadImage<ArrayBuffer>(url, origin);
    const buffer = Buffer.from(downloadResponse);
    const jimpImage = await Jimp.read(buffer);
    const thumbnails = await this.generateThumbnails(input, jimpImage, origin);
    const imageMeta = this.getImageMetadata(jimpImage, input);
    this.validateImageSize(imageMeta);
    const output = { ...input, ...thumbnails, ...imageMeta };
    this.logger.verbose("Image processed", { input, output });
    return output;
  }

  private prepareThumbnails({
    url,
    noThumbnails,
    ...thumbnails
  }: ImageCreateInput): Pick<
    ImageCreateInput,
    | "thumbnail20Url"
    | "thumbnail50Url"
    | "thumbnail100Url"
    | "thumbnail200Url"
    | "thumbnail500Url"
  > {
    return noThumbnails
      ? {
          thumbnail20Url: url,
          thumbnail50Url: url,
          thumbnail100Url: url,
          thumbnail200Url: url,
          thumbnail500Url: url,
          ...thumbnails,
        }
      : thumbnails;
  }

  private shouldNotLoadImage(
    input: Omit<ImageCreateInput, "noThumbnails">
  ): input is Image {
    const {
      url,
      width,
      height,
      mimetype,
      thumbnail20Url,
      thumbnail50Url,
      thumbnail100Url,
      thumbnail200Url,
      thumbnail500Url,
    } = input;
    return (
      [width, height, mimetype, url].every((value) => !isEmpty(value)) &&
      [
        thumbnail20Url,
        thumbnail50Url,
        thumbnail100Url,
        thumbnail200Url,
        thumbnail500Url,
      ].some((value) => !isEmpty(value))
    );
  }

  private async generateThumbnails(
    input: SetRequired<ImageCreateInput, "url">,
    image: JimpImage,
    origin: string | undefined
  ): Promise<
    Pick<
      Image,
      | "thumbnail20Url"
      | "thumbnail50Url"
      | "thumbnail100Url"
      | "thumbnail200Url"
      | "thumbnail500Url"
    >
  > {
    this.logger.verbose("Generating thumbnails...", { input });
    const {
      url,
      thumbnail20Url,
      thumbnail50Url,
      thumbnail100Url,
      thumbnail200Url,
      thumbnail500Url,
    } = input;
    // Generate a first lower-res thumbnail so that the next ones will be faster
    // to downscale
    const [thumbnail500UrlNew, thumbnailImage] = thumbnail500Url
      ? [thumbnail500Url, image]
      : await this.generateThumbnail(image, url, 500, origin);
    const thumbnailsToGen: { url?: string | null; size: ThumbnailSizes }[] = [
      { url: thumbnail20Url, size: 20 },
      { url: thumbnail50Url, size: 50 },
      { url: thumbnail100Url, size: 100 },
      { url: thumbnail200Url, size: 200 },
      { url: thumbnail500UrlNew, size: 500 },
    ];
    const thumbnailsUrls = await Promise.all(
      thumbnailsToGen.map<Promise<[string, JimpImage]>>(
        ({ url: thumbnailUrl, size }) =>
          isNil(thumbnailUrl)
            ? this.generateThumbnail(thumbnailImage, url, size, origin)
            : Promise.resolve([url, thumbnailImage])
      )
    );
    const output = {
      thumbnail20Url: thumbnailsUrls[0][0],
      thumbnail50Url: thumbnailsUrls[1][0],
      thumbnail100Url: thumbnailsUrls[2][0],
      thumbnail200Url: thumbnailsUrls[3][0],
      thumbnail500Url: thumbnailsUrls[4][0],
    };
    this.logger.verbose("Thumbnails generated", { input, output });
    return output;
  }

  private async generateThumbnail(
    image: JimpImage,
    srcUrl: string,
    size: number,
    origin: string | undefined
  ): Promise<[string, JimpImage]> {
    const urlInfo: ImageUrlInfo = { url: srcUrl, size, extension: "jpeg" };
    const thumbnailUrl = getThumbnailUrlFromImageUrl(urlInfo);
    const thumbnailKey = this.s3.getKeyFromApiDownloads(thumbnailUrl, origin);
    const jimpThumbnail = image
      .clone()
      .scaleToFit(size, size, Jimp.RESIZE_BILINEAR);
    const buffer = await jimpThumbnail.getBufferAsync("image/jpeg");
    await this.s3.upload(thumbnailKey, buffer);
    this.logger.verbose("generateThumbnail", {
      srcUrl,
      size,
      origin,
      thumbnailUrl,
      thumbnailKey,
    });
    return [thumbnailUrl, jimpThumbnail];
  }

  private getImageMetadata(
    image: JimpImage,
    { width, height, mimetype }: ImageCreateInput
  ): Pick<Image, "width" | "height" | "mimetype"> {
    return {
      width: width ?? image.bitmap.width,
      height: height ?? image.bitmap.height,
      mimetype: mimetype ?? image.getMIME(),
    };
  }

  private validateImageSize({
    width,
    height,
    mimetype,
  }: Pick<Image, "width" | "height" | "mimetype">) {
    const imageSize = width * height;
    const maxImageSize =
      MAX_IMAGE_SIZES_PX?.[mimetype] ?? DEFAULT_MAX_IMAGE_SIZE_PX;
    if (imageSize > maxImageSize) {
      throw new Error(`
      Image is too big! Dimensions are ${width} x ${height} = ${Math.round(
        imageSize * 1e-6
      )}Mpx while limit is ${Math.round(maxImageSize * 1e-6)}Mpx
      `);
    }
  }

  private getImageName({
    name,
    url,
    externalUrl,
  }: SetRequired<ImageCreateInput, "url">): string {
    const nameBase =
      name ??
      externalUrl?.substring(
        externalUrl?.lastIndexOf("/") + 1,
        externalUrl?.indexOf("?")
      ) ??
      url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
    const output = nameBase.replace(/\.[^/.]+$/, "");
    this.logger.verbose("getImageName", { name, url, externalUrl });
    return output;
  }
}
