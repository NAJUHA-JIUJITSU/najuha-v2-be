import { DateOrStringDate } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { tags } from 'typia';

export interface IPost {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** Post writer. */
  userId: IUser['id'];

  /** Post view count. */
  viewCount: number & tags.Type<'uint32'>;

  /** CreatedAt. */
  createdAt: DateOrStringDate;

  /** DeletedAt. */
  deletedAt: DateOrStringDate | null;
}
