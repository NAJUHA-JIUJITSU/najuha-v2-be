import { IFindPostsQueryOptions, IPost, IPostCreateDto, IPostDetail } from '../domain/interface/post.interface';
import { IUser } from '../../users/domain/interface/user.interface';
import { IPostLikeCreateDto } from '../domain/interface/post-like.interface';
import { IPostReportCreateDto } from '../domain/interface/post-report.interface';
import { TPaginationRet, TPaginationParam } from '../../../common/common-types';
import { IPostSnapshotCreateDto } from '../domain/interface/post-snapshot.interface';
import { IPostSnapshotImageCreateDto } from '../domain/interface/post-snapshot-image.interface';
import { tags } from 'typia';

// ---------------------------------------------------------------------------
// postAppService Param
// ---------------------------------------------------------------------------
export interface CreatePostParam
  extends Pick<IPostCreateDto, 'userId' | 'category'>,
    Pick<IPostSnapshotCreateDto, 'title' | 'body'> {
  /** 게시글 이미지는 최대 5개까지 등록 가능합니다. */
  imageIds?: IPostSnapshotImageCreateDto['imageId'][] & tags.MaxItems<5>;
}

export interface FindPostsParam extends TPaginationParam<IFindPostsQueryOptions> {}

export interface GetPostParam {
  userId?: IUser['id'];
  postId: IPost['id'];
}

export interface UpdatePostParam
  extends Pick<IPostCreateDto, 'userId'>,
    Pick<IPostSnapshotCreateDto, 'postId' | 'title' | 'body'> {
  /** 게시글 이미지는 최대 5개까지 등록 가능합니다. */
  imageIds?: IPostSnapshotImageCreateDto['imageId'][] & tags.MaxItems<5>;
}

export interface DeletePostParam {
  userId: IUser['id'];
  postId: IPost['id'];
}

export interface CreatePostLikeParam extends Pick<IPostLikeCreateDto, 'userId' | 'postId'> {}

export interface DeletePostLikeParam {
  userId: IUser['id'];
  postId: IPost['id'];
}

export interface CreatePostReportParam extends Pick<IPostReportCreateDto, 'userId' | 'postId' | 'type' | 'reason'> {}

export interface DeletePostReportParam {
  userId: IUser['id'];
  postId: IPost['id'];
}

// ---------------------------------------------------------------------------
// postAppService Result
// ---------------------------------------------------------------------------
export interface CreatePostRet {
  post: IPostDetail;
}

export interface GetPostRet {
  post: IPostDetail;
}

export interface FindPostsRet
  extends TPaginationRet<{
    posts: IPostDetail[];
  }> {}

export interface UpdatePostRet {
  post: IPostDetail;
}
