import { DateOrStringDate } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { tags } from 'typia';

export interface IComment {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** Comment writer. */
  userId: IUser['id'];

  /** Comment parent. */
  parentId: IComment['id'] | null;

  /** CreatedAt. */
  createdAt: DateOrStringDate;

  /** DeletedAt. */
  deletedAt: DateOrStringDate | null;
}
