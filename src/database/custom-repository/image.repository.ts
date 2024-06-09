import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ImageEntity } from '../entity/image/image.entity';

@Injectable()
export class ImageRepository extends Repository<ImageEntity> {
  constructor(private dataSource: DataSource) {
    super(ImageEntity, dataSource.createEntityManager());
  }
}
