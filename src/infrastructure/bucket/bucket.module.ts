import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import appEnv from 'src/common/app-env';
import { BucketService } from './bucket.service';

const MinioBucketConfig = {
  endpoint: appEnv.minioEndpoint,
  region: appEnv.minioRegion,
  credentials: {
    accessKeyId: appEnv.minioAccessKeyId,
    secretAccessKey: appEnv.minioSecreAccesstKey,
  },
  forcePathStyle: true,
};

const S3BucketConfig = {
  region: appEnv.s3Region,
  credentials: {
    accessKeyId: appEnv.s3AccessKeyId,
    secretAccessKey: appEnv.s3SecretAccessKey,
  },
};

const BucketConfigMap = {
  dev: MinioBucketConfig,
  test: MinioBucketConfig,
  prod: S3BucketConfig,
};

@Module({
  providers: [
    {
      provide: 'BUCKET_CLIENT',
      useFactory: () => {
        return new S3Client(BucketConfigMap[appEnv.nodeEnv]);
      },
    },
    BucketService,
  ],
  exports: [BucketService],
})
export class BucketModule {}
