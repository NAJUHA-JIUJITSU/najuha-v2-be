import { Module } from '@nestjs/common';
import { BucketModule } from '../../infrastructure/bucket/bucket.module';
import { ImagesController } from './presentation/images.controller';
import { ImageAppService } from './application/image.app.service';
import { DatabaseModule } from '../../database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './application/multer.config';

@Module({
  imports: [DatabaseModule, BucketModule, MulterModule.register(multerOptions)],
  controllers: [ImagesController],
  providers: [ImageAppService],
})
export class ImagesModule {}
