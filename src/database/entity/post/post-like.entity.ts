import { IPostLike } from '../../../modules/posts/domain/interface/post-like.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { PostEntity } from './post.entity';
import { UserEntity } from '../user/user.entity';

/**
 * PostLike.
 *
 * 게시글 좋아요 정보를 담는 Entity입니다.
 * 동일한 유저가 동일한 게시글에 여러 번 좋아요를 누를 수 없습니다. (중복 좋아요 불가능)
 *
 * @namespace Post
 */
@Entity('post_like')
@Unique('UQ_POST_LIKE', ['postId', 'userId'])
export class PostLikeEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPostLike['id'];

  /** 좋아요를 누른 UserId. */
  @Column('uuid')
  userId!: IPostLike['userId'];

  /** 좋아요 누른 일자. */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPostLike['createdAt'];

  /** 좋아요를 누른 게시글의 Id. */
  @Column('uuid')
  postId!: IPostLike['postId'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  @ManyToOne(() => PostEntity, (post) => post.likes)
  @JoinColumn({ name: 'postId' })
  post!: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.postLikes)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
