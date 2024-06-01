import { TDateOrStringDate, TId } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { tags } from 'typia';
import { IPostSnapshot } from './post-snapshot.interface';
import { IPostLike } from './post-like.interface';
import { IPostReport } from './post-report.interface';

export interface IPost {
  /** ULID. */
  id: TId;

  /** Post writer. */
  userId: IUser['id'];

  /** Post view count. */
  viewCount: number & tags.Type<'uint32'>;

  /** Post status. */
  status: 'ACTIVE' | 'INACTIVE';

  /** Post category. */
  category: 'FREE' | 'COMPETITION' | 'SEMINAR' | 'OPEN_MAT';

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** DeletedAt. */
  deletedAt: TDateOrStringDate | null;

  postSnapshots: IPostSnapshot[];

  likes?: IPostLike[];

  postReports?: IPostReport[];
}

export interface IPostRet
  extends Pick<
    IPost,
    'id' | 'userId' | 'viewCount' | 'status' | 'category' | 'createdAt' | 'deletedAt' | 'postSnapshots'
  > {
  likeCount: number;
  userLiked: boolean;
}

export interface IPostCreateDto extends Pick<IPost, 'userId' | 'category'>, Pick<IPostSnapshot, 'title' | 'body'> {}

export interface IPostUpdateDto extends Pick<IPostSnapshot, 'postId' | 'title' | 'body'> {}
