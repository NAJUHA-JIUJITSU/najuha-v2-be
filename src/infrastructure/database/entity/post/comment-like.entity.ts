import { ICommentLike } from 'src/modules/posts/domain/interface/comment-like.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ulid } from 'ulid';
import { CommentEntity } from './comment.entity';

// --- Comment Like Entity ---
@Entity('comment_like')
@Unique('UQ_COMMENT_LIKE', ['commentId', 'userId'])
export class CommentLikeEntity {
  @PrimaryColumn('varchar', { length: 26, default: ulid() })
  id!: ICommentLike['id'];

  @Column('varchar', { length: 26 })
  userId!: ICommentLike['userId'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICommentLike['createdAt'];

  @Column('varchar', { length: 26 })
  commentId!: ICommentLike['commentId'];

  @ManyToOne(() => CommentEntity, (comment) => comment.likes)
  @JoinColumn({ name: 'commentId' })
  comment!: CommentEntity;
}
