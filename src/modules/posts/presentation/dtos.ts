// Application Layer Request DTOs
import { CreatePostRet, FindPostsRet, GetPostRet, UpdatePostRet } from '../application/dtos';
import { IPostCreateDto, IPostUpdateDto } from '../domain/interface/post.interface';

// Presentation Layer Request DTOs ----------------------------------------------
export interface CreatePostReqBody extends IPostCreateDto {}

export interface UpdatePostReqBody extends Omit<IPostUpdateDto, 'id'> {}

export interface FindPostsQuery {
  page?: number;
  limit?: number;
  userId?: string;
}

// Presentation Layer Response DTOs ----------------------------------------------
export interface CreatePostRes extends CreatePostRet {}

export interface UpdatePostRes extends UpdatePostRet {}

export interface GetPostRes extends GetPostRet {}

export interface FindPostsRes extends FindPostsRet {}
