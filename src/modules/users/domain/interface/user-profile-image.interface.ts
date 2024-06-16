import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IUser } from './user.interface';
import { TImageFormat } from '../../../images/domain/interface/image.interface';

export interface IUserProfileImage {
  /** UUID v7. */
  id: TId;

  /** userId */
  userId: IUser['id'];

  format: TImageFormat;

  path: 'user-profile';

  linkedAt: TDateOrStringDate | null;

  /** createdAt */
  createdAt: TDateOrStringDate;

  /** deletedAt */
  deletedAt: TDateOrStringDate | null;
}

export interface IUserProfileImageCreateDto extends Pick<IUserProfileImage, 'userId' | 'format' | 'path'> {}
