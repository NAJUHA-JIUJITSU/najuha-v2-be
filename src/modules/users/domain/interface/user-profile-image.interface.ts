import { TDateOrStringDate, TId } from 'src/common/common-types';
import { IUser } from './user.interface';
import { IImage } from 'src/modules/images/domain/interface/image.interface';

export interface IUserProfileImage {
  /** uuid */
  id: TId;

  /** userId */
  userId: IUser['id'];

  /** imageId */
  imageId: IImage['id'];

  /** createdAt */
  createdAt: TDateOrStringDate;
}
