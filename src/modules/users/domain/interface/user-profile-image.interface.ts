import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IUser } from './user.interface';
import { IImage } from '../../../images/domain/interface/image.interface';

export interface IUserProfileImage {
  /** UUID v7. */
  id: TId;

  /** userId */
  userId: IUser['id'];

  /**
   * imageId
   * - u-9-1 createImage 로 생성된 image의 id
   */
  imageId: IImage['id'];

  /** createdAt */
  createdAt: TDateOrStringDate;

  /** deletedAt */
  deletedAt: TDateOrStringDate | null;

  image: IImage;
}

export interface IUserProfileImageCreateDto extends Pick<IUserProfileImage, 'userId' | 'imageId'> {}
