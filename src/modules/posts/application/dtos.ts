import { IPost } from '../domain/interface/post.interface';
import { IComment } from '../domain/interface/comment.interface';

// Application Layer Param DTOs ----------------------------------------------

export interface CreatePostParam {
  userId: string;
  title: string;
  body: string;
}

export interface FindPostsParam {
  userId: string;
  page: number;
  limit: number;
}

export interface GetPostParam {
  userId: string;
  postId: string;
}

export interface UpdatePostParam {
  userId: string;
  postId: string;
  title: string;
  body: string;
}

export interface CreateCommentParam {
  userId: string;
  postId: string;
  body: string;
}

export interface CreateReplyParam {
  userId: string;
  commentId: string;
  body: string;
}

export interface FindCommentsParam {
  userId: string;
  postId: string;
  page: number;
  limit: number;
}

export interface GetCommentParam {
  userId: string;
  commentId: string;
}

export interface UpdateCommentParam {
  userId: string;
  commentId: string;
  body: string;
}

// Application Layer Result DTOs ----------------------------------------------

export interface CreatePostRet {
  post: any; // Replace 'any' with the appropriate type, e.g., PostEntity
}

export interface FindPostsRet {
  posts: any[]; // Replace 'any' with the appropriate type, e.g., PostEntity[]
  nextPage?: number;
}

export interface GetPostRet {
  post: any; // Replace 'any' with the appropriate type, e.g., PostEntity
}

export interface UpdatePostRet {
  post: any; // Replace 'any' with the appropriate type, e.g., PostEntity
}

export interface CreateCommentRet {
  comment: any; // Replace 'any' with the appropriate type, e.g., CommentEntity
}

export interface CreateReplyRet {
  comment: any; // Replace 'any' with the appropriate type, e.g., CommentEntity
}

export interface FindCommentsRet {
  comments: any[]; // Replace 'any' with the appropriate type, e.g., CommentEntity[]
  nextPage?: number;
}

export interface GetCommentRet {
  comment: any; // Replace 'any' with the appropriate type, e.g., CommentEntity
}

export interface UpdateCommentRet {
  comment: any; // Replace 'any' with the appropriate type, e.g., CommentEntity
}
