import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IImage } from '../../../images/domain/interface/image.interface';
import { IPostSnapshot } from './post-snapshot.interface';

export interface IPostSnapshotImage {
  /** UUID v7. */
  id: TId;

  /** postSnapshotId. */
  postSnapshotId: IPostSnapshot['id'];

  /**
   * imageId.
   * - u-9-1 createImage 로 생성된 image의 id
   */
  imageId: IImage['id'];

  /**
   * sequence.
   * - 이미지의 순서
   */
  sequence: number;

  /** createdAt. */
  createdAt: TDateOrStringDate;

  image: IImage;
}

export interface IPostSnapshotImageCreateDto extends Pick<IPostSnapshotImage, 'postSnapshotId' | 'imageId' | 'image'> {}
