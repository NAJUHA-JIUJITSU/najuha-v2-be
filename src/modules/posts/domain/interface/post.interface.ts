import { TDateOrStringDate, TId } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { tags } from 'typia';
import { IPostSnapshot } from './post-snapshot.interface';
import { IPostLike } from './post-like.interface';
import { IPostReport } from './post-report.interface';

export interface IPost {
  /** UUID v7. */
  id: TId;

  /** Post writer. */
  userId: IUser['id'];

  /** Post view count. */
  viewCount: number & tags.Type<'uint32'>;

  /** Post status. */
  status: TPostStatus;

  /**
   * Post category.
   * - FREE: 자유 게시판.
   * - COMPETITION: 대회 게시판.
   * - SEMINAR: 세미나 게시판.
   * - OPEN_MAT: 오픈 매트 게시판.
   */
  category: TPostCategory;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** DeletedAt. */
  deletedAt: TDateOrStringDate | null;

  postSnapshots: IPostSnapshot[];

  likes?: IPostLike[];

  likeCount?: number;

  commentCount?: number;

  userLiked?: boolean;

  reports?: IPostReport[];
}

export interface IPostDetail
  extends Pick<
    IPost,
    | 'id'
    | 'userId'
    | 'viewCount'
    | 'status'
    | 'category'
    | 'createdAt'
    | 'deletedAt'
    | 'postSnapshots'
    | 'likeCount'
    | 'commentCount'
    | 'userLiked'
  > {}

export interface IPostCreateDto extends Pick<IPost, 'userId' | 'category'>, Pick<IPostSnapshot, 'title' | 'body'> {}

export interface IPostUpdateDto extends Pick<IPostSnapshot, 'postId' | 'title' | 'body'> {}

export interface IFindPostsQueryOptions {
  /**
   * 게시물 status 필터.
   */
  status?: TPostStatus;

  /**
   * User ID.
   * 좋아요 여부를 판단하기 위해 사용됩니다.
   */
  userId?: IUser['id'];

  /**
   * 카테고리 필터.
   * - POPULAR 옵션을 선택하면 다른 카테고리 옵션은 무시됩니다.
   * - FREE, COMPETITION, SEMINAR, OPEN_MAT 옵션들은 동시에 여러 개 선택 가능합니다.
   * - categoryFilters를 요청하지 않으면 모든 카테고리에서 게시물을 조회합니다.
   *
   * categofyFilters:
   * - POPULAR: 인기 게시판, 좋아요 수가 10개 이상인 게시물만 조회.
   * - FREE: 자유 게시판.
   * - COMPETITION: 대회 게시판.
   * - SEMINAR: 세미나 게시판.
   * - OPEN_MAT: 오픈 매트 게시판.
   *
   */
  categoryFilters?: (TPostCategory | 'POPULAR')[];

  /**
   *  정렬 옵션.
   * - 최신순: 최신 게시물이 위로 올라오는 순서.
   * - 조회순: 조회수가 높은 게시물이 위로 올라오는 순서.
   */
  sortOption: '최신순' | '조회순';
}

type TPostStatus = 'ACTIVE' | 'INACTIVE';

type TPostCategory = 'FREE' | 'COMPETITION' | 'SEMINAR' | 'OPEN_MAT';
