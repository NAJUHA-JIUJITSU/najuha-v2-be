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
/**
 * Post.
 * 게시글을 식별하는 최상위 엔티티로서 개별 게시글의 메타데이터를 담고 있습니다.
 *
 * 게시글의 필수 요소 `title`, `body` 등은 `post`에 존재하지 않고, `post_snapshot`에 저장되어 있습니다.
 * `post`와 `post_snapshot`는 1:N 관계로 연결되어 있는데, 이는 글이 수정될때마다 새로운 스냅샷 레코드가 생성되기 때문입니다.
 *
 * 게시글이 수정될때마다 새로운 스냅샷 레코드가 생성되는 이유는 증거를 보존 및 추적하기 위함입니다. 온라인 커뮤니티의 특성상 참여자 간에는 항상 분쟁의 위험이 존재합니다.
 * 그리고 분쟁은 글이나 댓글을 통해 발생할 수 있으며, 기존 글을 수정하여 상황을 조작하는 등의 행위를 방지하기 위해 이러한 구조로 설계되었습니다. 즉, 증거를 보관하고 사기를 방지하기 위한 것입니다.
 *
 * @namespace Post
 */
export interface IPost {
  /** UUID v7. */
  id: TId;

  /** 게시글 작성자 UserId. */
  userId: IUser['id'];

  /** 게시글 조회수. */
  viewCount: number & tags.Type<'uint32'>;

  /**
   * 게시글 상태. default: `ACTIVE`.
   * - `ACTIVE`: 유저에게 노출.
   * - `INACTIVE`: 유저에게 노출되지 않음.
   * 관리자의 판단 하에 `INACTIVE`로 변경될 수 있습니다.
   * 신고 회수가 10회 이상이면 자동으로 `INACTIVE` 처리됩니다. 관리자의 판단 하에 `ACTIVE`로 변경될 수 있습니다.
   */
  status: TPostStatus;

  /**
   * Post category.
   * - FREE: 자유 게시판.
   * - COMPETITION: 대회 게시판.
   * - SEMINAR: 세미나 게시판.
   * - OPEN_MAT: 오픈 매트 게시판.
   */
  category: TPostCategory;

  /** 게시글 작성일자. */
  createdAt: TDateOrStringDate;

  /** 게시글 삭제일자. */
  deletedAt: TDateOrStringDate | null;

  /**
   * 좋아요 수.
   *
   * 조회시에만 사용됩니다.
   */
  likeCount: number;

  /**
   * 댓글 수.
   *
   * 조회시에만 사용됩니다.
   */
  commentCount: number;

  /**
   * 해당 개시글을 조회한 유저가 좋아요를 눌렀는지 여부.
   *
   * 조회시에만 사용됩니다.
   */
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
