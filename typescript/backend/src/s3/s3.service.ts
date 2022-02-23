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
import { AxiosResponse } from "axios";
import { isEmpty, isNil } from "lodash/fp";
import { Observable } from "rxjs";
import { URL } from "url";
import {
  AWS_ACCESS_KEY_ID_ENV,
  AWS_S3_BUCKET_ENV,
  AWS_S3_ENDPOINT_ENV,
  AWS_S3_REGION_ENV,
  DEFAULT_AWS_S3_BUCKET,
} from "../constants";

const DOWNLOAD_ACCEPT_HEADER =
  "image/tiff,image/jpeg,image/png,application/zip,image/*,*/*;q=0.8";

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

  private readonly bucket: string;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService
  ) {
    const clientConfig = this.getClientConfig();
    this.s3 = new S3Client(clientConfig);
    this.bucket = config.get(AWS_S3_BUCKET_ENV, DEFAULT_AWS_S3_BUCKET);
  }

  private getClientConfig(): S3ClientConfig {
    const region = this.getRequiredConfig(AWS_S3_REGION_ENV);
    const accessKeyId = this.getRequiredConfig(AWS_ACCESS_KEY_ID_ENV);
    const secretAccessKey = this.getRequiredConfig(AWS_ACCESS_KEY_ID_ENV);
    const endpointConfig = this.getEndpointConfig();
    return {
      region,
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
    const endpointUrl = this.config.get(AWS_S3_ENDPOINT_ENV);
    if (isNil(endpointUrl) || isEmpty(endpointUrl)) return undefined;
    // If we set an given endpoint, it means that we're using MinIO
    // See https://docs.min.io/docs/how-to-use-aws-sdk-for-javascript-with-minio-server.html
    const { protocol, host, pathname: path } = new URL(endpointUrl);
    return {
      endpoint: {
        // Remove trailing colon
        protocol: protocol.slice(0, -1),
        // Needs to contains the port, so host, not hostname
        hostname: host,
        // Required, else we have this issue:
        // https://github.com/aws/aws-sdk-js-v3/issues/1941#issuecomment-824194714
        path,
      },
      forcePathStyle: true,
    };
  }

  public async getSignedUploadUrl(
    key: string,
    options?: RequestPresigningArguments
  ): Promise<string> {
    if (isEmpty(key)) {
      throw new Error("S3 key cannot be empty");
    }
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: key });
    return await this.getSignedUrl(command, options);
  }

  public async getSignedDownloadUrl(
    key: string,
    options?: RequestPresigningArguments
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return await this.getSignedUrl(command, options);
  }

  private async getSignedUrl(
    command: GetObjectCommand | PutObjectCommand,
    options?: RequestPresigningArguments
  ): Promise<string> {
    const allOptions = { ...DEFAULT_REQUEST_PRESIGNING_ARGUMENTS, ...options };
    return await getSignedUrl(this.s3, command, allOptions);
  }

  public async upload(
    key: string,
    data: unknown
  ): Promise<Observable<AxiosResponse>> {
    const url = await this.getSignedUploadUrl(key);
    return this.http.put(url, { body: data });
  }

  public async download(
    key: string,
    { cookieHeader: cookie, ...options }: DownloadOptions = {}
  ): Promise<Observable<AxiosResponse>> {
    const cookieHeader =
      isNil(cookie) || isEmpty(cookie) ? undefined : { Cookie: cookie };
    const headers = {
      Accept: DOWNLOAD_ACCEPT_HEADER,
      "Sec-Fetch-Dest": "image",
      ...cookieHeader,
    };
    const url = await this.getSignedDownloadUrl(key, options);
    return this.http.get(url, { headers });
  }

  public async delete(key: string): Promise<void> {
    const msg = `Unsupported ${S3Service.name}.delete("${key}") called`;
    this.logger.warn(msg);
  }
}
