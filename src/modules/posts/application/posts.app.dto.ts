import {
  IFindPostsQueryOptions,
  IPost,
  IPostCreateDto,
  IPostDetail,
  IPostUpdateDto,
} from '../domain/interface/post.interface';
import { IUser } from '../../users/domain/interface/user.interface';
import { IPostLikeCreateDto } from '../domain/interface/post-like.interface';
import { IPostReportCreateDto } from '../domain/interface/post-report.interface';
import { TPaginationRet, TPaginationParam } from '../../../common/common-types';

// ---------------------------------------------------------------------------
// postAppService Param
// ---------------------------------------------------------------------------
export interface CreatePostParam {
  postCreateDto: IPostCreateDto;
}

export interface FindPostsParam extends TPaginationParam<IFindPostsQueryOptions> {}

export interface GetPostParam {
  userId?: IUser['id'];
  postId: IPost['id'];
}

export interface UpdatePostParam {
  postUpdateDto: IPostUpdateDto;
}

export interface DeletePostParam {
  userId: IUser['id'];
  postId: IPost['id'];
}

export interface CreatePostLikeParam {
  postLikeCreateDto: Pick<IPostLikeCreateDto, 'userId' | 'postId'>;
}

export interface DeletePostLikeParam {
  userId: IUser['id'];
  postId: IPost['id'];
}

export interface CreatePostReportParam {
  postReportCreateDto: Pick<IPostReportCreateDto, 'userId' | 'postId' | 'type' | 'reason'>;
}

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
