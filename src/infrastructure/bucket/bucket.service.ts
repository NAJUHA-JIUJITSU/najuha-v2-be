import appEnv from '../../common/app-env';
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { S3Client, CreateBucketCommand, HeadBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { GetPresignedPostUrlParam, TPresignedPost } from './bucket.interface';

@Injectable()
export class BucketService implements OnModuleInit {
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
        const createCommand = new CreateBucketCommand({ Bucket: this.bucket });
        await this.client.send(createCommand);
        console.log(`Bucket ${this.bucket} created`);
      } else {
        throw error;
      }
    }

    // Set bucket policy to make it public
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject', 's3:ListBucket'],
          Resource: [`arn:aws:s3:::${this.bucket}`, `arn:aws:s3:::${this.bucket}/*`],
        },
      ],
    };

    const policyCommand = new PutBucketPolicyCommand({
      Bucket: this.bucket,
      Policy: JSON.stringify(policy),
    });

    await this.client.send(policyCommand);
    console.log(`Bucket ${this.bucket} is now public`);
  }

  async getPresignedPostUrl({
    path,
    key,
    format,
    expiresIn,
    maxSize,
  }: GetPresignedPostUrlParam): Promise<TPresignedPost> {
    const fullKey = `${path}/${key}`;

    return await createPresignedPost(this.client, {
      Bucket: this.bucket,
      Key: fullKey,
      Conditions: [['content-length-range', 0, maxSize], { key: fullKey }],
      Fields: {
        'Content-Type': format,
      },
      Expires: expiresIn,
    });
  }
}
