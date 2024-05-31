import { TDateOrStringDate, TId } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { tags } from 'typia';

export interface IPost {
  /** ULID. */
  id: TId;

  /** Post writer. */
  userId: IUser['id'];

  /** Post view count. */
  viewCount: number & tags.Type<'uint32'>;

  /** Post status. */
  status: 'ACTIVE' | 'INACTIVE';

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** DeletedAt. */
  deletedAt: TDateOrStringDate | null;
}
