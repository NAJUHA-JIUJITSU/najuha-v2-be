import { ICommentSnapshot } from 'src/modules/posts/domain/interface/comment-snapshot.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { CommentEntity } from './comment.entity';

/**
 * CommentSnapshot.
 *
 * 댓글의 스냅샷 정보를 담는 Entity입니다.
 * `comment`에서 언급한 것처럼 증거를 보관하고 사기를 방지하기 위해 댓글 레코드에서 댓글 내용을 분리하여 보관합니다.
 *
 * @namespace Post
 */
@Entity('comment_snapshot')
export class CommentSnapshotEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: ICommentSnapshot['id'];

  /** 댓글 내용. */
  @Column('text')
  body!: ICommentSnapshot['body'];

  /** 댓글 작성일자. */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICommentSnapshot['createdAt'];

  /** 댓글 Id. */
  @Column('uuid')
  commentId!: ICommentSnapshot['commentId'];

  //------------------------------------------------------------
  // Relations
  //------------------------------------------------------------
  @ManyToOne(() => CommentEntity, (comment) => comment.commentSnapshots)
  @JoinColumn({ name: 'commentId' })
  comment!: CommentEntity;
}
