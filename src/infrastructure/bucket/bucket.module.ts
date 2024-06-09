import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import appEnv from 'src/common/app-env';
import { BucketService } from './bucket.service';

const BucketConfig = {
  endpoint: appEnv.minioEndpoint,
  region: appEnv.minioRegion,
  credentials: {
    accessKeyId: appEnv.minioAccessKey,
    secretAccessKey: appEnv.minioSecretKey,
  },
  forcePathStyle: true,
};

@Module({
  providers: [
    {
      provide: 'MINIO_CLIENT',
      useFactory: () => {
        return new S3Client(BucketConfig);
      },
    },
    BucketService,
  ],
  exports: [BucketService],
})
export class BucketModule {}
