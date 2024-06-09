import appEnv from 'src/common/app-env';
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { S3Client, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { IBucketService } from './bucket.interface';

@Injectable()
export class BucketService implements IBucketService, OnModuleInit {
  private readonly bucket: string = appEnv.minioBucket;

  constructor(@Inject('BUCKET_CLIENT') private readonly client: S3Client) {}

  async onModuleInit() {
    await this.ensureBucket();
  }

  private async ensureBucket() {
    try {
      const command = new HeadBucketCommand({ Bucket: this.bucket });
      await this.client.send(command);
      console.log(`Bucket ${this.bucket} exists`);
    } catch (error: any) {
      if (error.name === 'NotFound') {
        const command = new CreateBucketCommand({ Bucket: this.bucket });
        await this.client.send(command);
        console.log(`Bucket ${this.bucket} created`);
      } else {
        throw error;
      }
    }
  }

  async getPresignedPostUrl({ path, key, expiresIn, maxSize }) {
    const fullKey = `${path}/${key}`;

    return await createPresignedPost(this.client, {
      Bucket: this.bucket,
      Key: fullKey,
      Conditions: [['content-length-range', 0, maxSize], { key: fullKey }],
      Expires: expiresIn,
    });
  }
}
