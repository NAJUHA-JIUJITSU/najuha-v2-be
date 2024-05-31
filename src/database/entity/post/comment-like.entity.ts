import { ICommentLike } from 'src/modules/posts/domain/interface/comment-like.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { CommentEntity } from './comment.entity';
import { UserEntity } from '../user/user.entity';

/**
 * CommentLike.
 *
 * 댓글 좋아요 정보를 담는 Entity입니다.
 * 동일한 유저가 동일한 댓글에 여러 번 좋아요를 누를 수 없습니다. (중복 좋아요 불가능)
 *
 * @namespace Post
 */
@Entity('comment_like')
@Unique('UQ_COMMENT_LIKE', ['commentId', 'userId'])
export class CommentLikeEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: ICommentLike['id'];

  /** 좋아요를 누른 UserId. */
  @Column('uuid')
  userId!: ICommentLike['userId'];

  /** 좋아요 누른 일자. */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICommentLike['createdAt'];

  /** 좋아요를 누른 댓글의 Id. */
  @Column('uuid')
  commentId!: ICommentLike['commentId'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  @ManyToOne(() => CommentEntity, (comment) => comment.likes)
  @JoinColumn({ name: 'commentId' })
  comment!: CommentEntity;

  @ManyToOne(() => UserEntity, (user) => user.commentLikes)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
