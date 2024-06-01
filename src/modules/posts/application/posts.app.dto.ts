import { IPost, IPostCreateDto, IPostRet, IPostUpdateDto } from '../domain/interface/post.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPostLikeCreateDto } from '../domain/interface/post-like.interface';
import { IPostReport, IPostReportCreateDto } from '../domain/interface/post-report.interface';

// ---------------------------------------------------------------------------
// postAppService Param
// ---------------------------------------------------------------------------
export interface CreatePostParam {
  postCreateDto: IPostCreateDto;
}

export interface FindPostsParam {
  userId?: IUser['id'];
  page: number;
  limit: number;
}

export interface GetPostParam {
  userId: IUser['id'];
  postId: IPost['id'];
}

export interface UpdatePostParam {
  userId: IUser['id'];
  postUpdateDto: IPostUpdateDto;
}

export interface DeletePostParam {
  userId: IUser['id'];
  postId: IPost['id'];
}

export interface CreatePostLikeParam {
  postLikeCreateDto: IPostLikeCreateDto;
}

export interface DeletePostLikeParam {
  userId: IUser['id'];
  postId: IPost['id'];
}

export interface CreatePostReportParam {
  postReportCreateDto: IPostReportCreateDto;
}

export interface DeletePostReportParam {
  userId: IUser['id'];
  postId: IPost['id'];
}

// ---------------------------------------------------------------------------
// postAppService Result
// ---------------------------------------------------------------------------
export interface CreatePostRet {
  post: IPostRet;
}

export interface GetPostRet {
  post: IPostRet;
}

export interface FindPostsRet {
  posts: IPostRet[];
  nextPage?: number;
}

export interface UpdatePostRet {
  post: IPostRet;
}
