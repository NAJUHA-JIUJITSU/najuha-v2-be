import { tags } from 'typia';
import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IImage, IImageModelData } from '../../../images/domain/interface/image.interface';
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
   * - 이미지의 순서, 0부터 시작.
   */
  sequence: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /** createdAt. */
  createdAt: TDateOrStringDate;

  image: IImage;
}

export interface IPostSnapshotImageModleData {
  id: IPostSnapshotImage['id'];
  postSnapshotId: IPostSnapshotImage['postSnapshotId'];
  imageId: IPostSnapshotImage['imageId'];
  sequence: IPostSnapshotImage['sequence'];
  createdAt: IPostSnapshotImage['createdAt'];
  image?: IImageModelData;
}

export interface IPostSnapshotImageCreateDto
  extends Pick<IPostSnapshotImage, 'postSnapshotId' | 'imageId' | 'sequence'> {}
