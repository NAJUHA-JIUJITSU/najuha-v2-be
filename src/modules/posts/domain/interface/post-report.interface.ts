import { IPost } from './post.interface';
import { TDateOrStringDate, TId } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

export interface IPostReport {
  /** ULID. */
  id: TId;

  /** Post Id. */
  postId: IPost['id'];

  /** User Id. */
  userId: IUser['id'];

  /** CreatedAt. */
  createdAt: TDateOrStringDate;
}

export interface IPostReportCreateDto extends Pick<IPostReport, 'postId' | 'userId'> {}
