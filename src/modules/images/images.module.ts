import { Module } from '@nestjs/common';
import { BucketModule } from 'src/infrastructure/bucket/bucket.module';
import { ImagesController } from './presentation/images.controller';
import { ImageAppService } from './application/image.app.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, BucketModule],
  controllers: [ImagesController],
  providers: [ImageAppService],
})
export class ImagesModule {}
