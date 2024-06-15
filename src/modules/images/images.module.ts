import { Module } from '@nestjs/common';
import { BucketModule } from '../../infrastructure/bucket/bucket.module';
import { UserImagesController } from './presentation/user-images.controller';
import { ImageAppService } from './application/image.app.service';
import { DatabaseModule } from '../../database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './application/multer.config';

@Module({
  imports: [DatabaseModule, BucketModule, MulterModule.register(multerOptions)],
  controllers: [UserImagesController],
  providers: [ImageAppService],
})
export class ImagesModule {}
