import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IUser, IUserModelData, IUserPublicProfile } from '../../../users/domain/interface/user.interface';
import { tags } from 'typia';
import { IPostSnapshot, IPostSnapshotCreateDto, IPostSnapshotModelData } from './post-snapshot.interface';
import { IPostLike, IPostLikeModelData } from './post-like.interface';
import { IPostReport, IPostReportModelData } from './post-report.interface';
import { IPostSnapshotImageCreateDto } from './post-snapshot-image.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
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

  likeCount: number;

  commentCount: number;

  userLiked: boolean;

  postSnapshots: IPostSnapshot[];

  likes: IPostLike[];

  reports: IPostReport[];

  user: IUserPublicProfile;
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IPostModelData {
  id: IPost['id'];
  userId: IPost['userId'];
  viewCount: IPost['viewCount'];
  status: IPost['status'];
  category: IPost['category'];
  createdAt: IPost['createdAt'];
  deletedAt: IPost['deletedAt'];
  likeCount?: IPost['likeCount'];
  commentCount?: IPost['commentCount'];
  userLiked?: IPost['userLiked'];
  postSnapshots: IPostSnapshotModelData[];
  likes?: IPostLikeModelData[];
  reports?: IPostReportModelData[];
  user?: IUserModelData;
}

// ----------------------------------------------------------------------------
// return interface
// ----------------------------------------------------------------------------
export interface IPost
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
    | 'user'
  > {}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IPostCreateDto
  extends Pick<IPost, 'userId' | 'category'>,
    Pick<IPostSnapshotCreateDto, 'title' | 'body'> {
  /** 게시글 이미지는 최대 5개까지 등록 가능합니다. */
  imageIds?: IPostSnapshotImageCreateDto['imageId'][] & tags.MaxItems<5>;
}

export interface IPostUpdateDto
  extends Pick<IPost, 'userId'>,
    Pick<IPostSnapshotCreateDto, 'postId' | 'title' | 'body'> {
  /** 게시글 이미지는 최대 5개까지 등록 가능합니다. */
  imageIds?: IPostSnapshotImageCreateDto['imageId'][] & tags.MaxItems<5>;
}

// ----------------------------------------------------------------------------
// Query Options
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// ENUM
// ----------------------------------------------------------------------------
type TPostStatus = 'ACTIVE' | 'INACTIVE';

type TPostCategory = 'FREE' | 'COMPETITION' | 'SEMINAR' | 'OPEN_MAT';
