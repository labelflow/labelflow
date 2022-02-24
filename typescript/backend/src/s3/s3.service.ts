import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { RequestPresigningArguments } from "@aws-sdk/types";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isEmpty, isNil } from "lodash/fp";
import { lastValueFrom } from "rxjs";
import { URL } from "url";
import {
  AWS_ACCESS_KEY_ID_ENV,
  AWS_S3_BUCKET_ENV,
  AWS_S3_ENDPOINT_ENV,
  AWS_S3_REGION_ENV,
  DEFAULT_AWS_S3_BUCKET,
} from "../constants";

const DEFAULT_REQUEST_PRESIGNING_ARGUMENTS: RequestPresigningArguments = {
  expiresIn: 3600,
};

export type DownloadOptions = RequestPresigningArguments & {
  cookieHeader?: string;
};

@Injectable()
export class S3Service {
  private logger = new Logger(S3Service.name);

  private readonly s3: S3Client;

  private readonly endpointUrl?: string;

  private readonly region: string;

  private readonly bucket: string;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService
  ) {
    this.endpointUrl = this.config.get(AWS_S3_ENDPOINT_ENV);
    const clientConfig = this.getClientConfig();
    this.s3 = new S3Client(clientConfig);
    this.region = this.getRequiredConfig(AWS_S3_REGION_ENV);
    this.bucket = config.get(AWS_S3_BUCKET_ENV, DEFAULT_AWS_S3_BUCKET);
  }

  private getClientConfig(): S3ClientConfig {
    const accessKeyId = this.getRequiredConfig(AWS_ACCESS_KEY_ID_ENV);
    const secretAccessKey = this.getRequiredConfig(AWS_ACCESS_KEY_ID_ENV);
    const endpointConfig = this.getEndpointConfig();
    return {
      region: this.region,
      credentials: { accessKeyId, secretAccessKey },
      ...endpointConfig,
    };
  }

  private getRequiredConfig(varName: string): string {
    const value = this.config.get(varName);
    if (!isNil(value) && !isEmpty(value)) return value;
    const msg = `Missing ${varName} environment variable`;
    throw new Error(msg);
  }

  private getEndpointConfig(): Partial<S3ClientConfig> | undefined {
    if (isNil(this.endpointUrl) || isEmpty(this.endpointUrl)) return undefined;
    // If we set an given endpoint, it means that we're using MinIO
    // See https://docs.min.io/docs/how-to-use-aws-sdk-for-javascript-with-minio-server.html
    const { protocol, host, pathname } = new URL(this.endpointUrl);
    return {
      endpoint: {
        // Remove trailing colon
        protocol: protocol.slice(0, -1),
        hostname: host,
        // port: parseInt(port, 10),
        // Required, else we have this issue:
        // https://github.com/aws/aws-sdk-js-v3/issues/1941#issuecomment-824194714
        path: pathname,
      },
      forcePathStyle: true,
    };
  }

  public getBucketUrl(): string {
    return (
      `${this.endpointUrl}/${this.bucket}` ??
      `https://${this.bucket}.s3.${this.region}.amazonaws.com`
    );
  }

  public async getSignedUploadUrl(
    key: string,
    options?: RequestPresigningArguments
  ): Promise<string> {
    if (isEmpty(key)) {
      throw new Error("S3 key cannot be empty");
    }
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: key });
    const url = await this.getSignedUrl(command, options);
    this.logger.verbose("getSignedUploadUrl", { key, url });
    return url;
  }

  public async getSignedDownloadUrl(
    key: string,
    options?: RequestPresigningArguments
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const url = await this.getSignedUrl(command, options);
    this.logger.verbose("getSignedDownloadUrl", { key, url });
    return url;
  }

  private async getSignedUrl(
    command: GetObjectCommand | PutObjectCommand,
    options?: RequestPresigningArguments
  ): Promise<string> {
    const allOptions = { ...DEFAULT_REQUEST_PRESIGNING_ARGUMENTS, ...options };
    return await getSignedUrl(this.s3, command, allOptions);
  }

  public async upload(key: string, data: ArrayBuffer): Promise<void> {
    this.logger.verbose("upload", { key, bytes: data.byteLength });
    // const command = new PutObjectCommand({
    //   Bucket: this.bucket,
    //   Key: key,
    //   Body: data,
    // });
    // await this.s3.send(command);
    const url = await this.getSignedUploadUrl(key);
    const observable = this.http.put(url, data, {
      headers: { "Content-Length": data.byteLength },
    });
    const response = await lastValueFrom(observable);
    if (response.status === 200) return;
    throw new Error(`Failed to upload file with key ${key}`);
  }

  public async delete(key: string): Promise<void> {
    const msg = `Unsupported ${S3Service.name}.delete("${key}") called`;
    this.logger.warn(msg);
  }

  public getApiDownloadsUrl(origin: string, key: string = ""): string {
    return `${origin}/api/downloads/${key}`;
  }

  public isBucketUrl(url: string): boolean {
    const bucketUrl = this.getBucketUrl();
    return url.startsWith(bucketUrl);
  }

  public isApiDownloadUrl(
    url: string,
    origin: string | undefined
  ): origin is NonNullable<string> {
    return !isNil(origin) && url.startsWith(this.getApiDownloadsUrl(origin));
  }

  public isInternalUrl(
    url: string,
    origin: string | undefined
  ): origin is NonNullable<string> {
    return this.isBucketUrl(url) || this.isApiDownloadUrl(url, origin);
  }

  public getKeyFromApiDownloads(
    url: string,
    origin: string | undefined
  ): string {
    if (!this.isApiDownloadUrl(url, origin))
      throw new Error("URL does not points to /api/downloads");
    const apiDownloads = this.getApiDownloadsUrl(origin);
    const output = url.substring(apiDownloads.length);
    this.logger.verbose("getKeyFromApiDownloads", { url, origin, output });
    return output;
  }
}
