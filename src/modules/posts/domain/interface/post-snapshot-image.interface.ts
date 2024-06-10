import { TDateOrStringDate, TId } from 'src/common/common-types';
import { IImage } from 'src/modules/images/domain/interface/image.interface';
import { IPostSnapshot } from './post-snapshot.interface';

export interface IPostSnapshotImage {
  /** UUID v7. */
  id: TId;

  /** postSnapshotId */
  postSnapshotId: IPostSnapshot['id'];

  /**
   * imageId
   * - u-9-1 createImage 로 생성된 image의 id
   */
  imageId: IImage['id'];

  /** createdAt */
  createdAt: TDateOrStringDate;

  image: IImage;
}

export interface IPostSnapshotImageCreateDto extends Pick<IPostSnapshotImage, 'postSnapshotId' | 'imageId' | 'image'> {}
