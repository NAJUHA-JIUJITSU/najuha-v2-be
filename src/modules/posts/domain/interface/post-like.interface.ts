import { IPost } from './post.interface';
import { IUser } from '../../../users/domain/interface/user.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * PostLike.
 *
 * 게시글 좋아요 정보를 담는 Entity입니다.
 * 동일한 유저가 동일한 게시글에 여러 번 좋아요를 누를 수 없습니다. (중복 좋아요 불가능)
 *
 * @namespace Post
 */
export interface IPostLike {
  /** UUID v7. */
  id: TId;

  /** 좋아요를 누른 UserId. */
  userId: IUser['id'];

  /** 좋아요 누른 일자. */
  createdAt: TDateOrStringDate;

  /** 좋아요를 누른 게시글의 Id. */
  postId: IPost['id'];
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IPostLikeModelData {
  id: IPostLike['id'];
  postId: IPostLike['postId'];
  userId: IPostLike['userId'];
  createdAt: IPostLike['createdAt'];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IPostLikeCreateDto extends Pick<IPostLike, 'postId' | 'userId'> {}
