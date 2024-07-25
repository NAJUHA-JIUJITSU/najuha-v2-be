import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IUser } from './user.interface';
import { IImage, IImageModelData } from '../../../images/domain/interface/image.interface';

// --------------------------------------------------------------
// Base Interface
// --------------------------------------------------------------
/**
 * UserProfileImage.
 *
 * 사용자 프로필 이미지 정보.
 * - ImageEntity 와 UserEntity 를 연결하는 엔티티.
 * - 실제 이미지 정보는 ImageEntity 에 저장되어 있습니다.
 *
 * @namespace User
 * @erd Image
 */
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

  createdAt: TDateOrStringDate;

  deletedAt: TDateOrStringDate | null;

  image: IImage;
}

// --------------------------------------------------------------
// Model Data
// --------------------------------------------------------------
export interface IUserProfileImageModelData {
  id: IUserProfileImage['id'];
  userId: IUserProfileImage['userId'];
  imageId: IUserProfileImage['imageId'];
  createdAt: IUserProfileImage['createdAt'];
  deletedAt: IUserProfileImage['deletedAt'];
  image?: IImageModelData;
}

// --------------------------------------------------------------
// DTO
// --------------------------------------------------------------
export interface IUserProfileImageCreateDto extends Pick<IUserProfileImage, 'userId' | 'imageId'> {}
