import { ICommentSnapshot } from 'src/modules/posts/domain/interface/comment-snapshot.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ulid } from 'ulid';
import { CommentEntity } from './comment.entity';

// --- Comment Snapshot Entity ---
@Entity('comment_snapshot')
export class CommentSnapshotEntity {
  @PrimaryColumn('varchar', { length: 26, default: ulid() })
  id!: ICommentSnapshot['id'];

  @Column('text')
  body!: ICommentSnapshot['body'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICommentSnapshot['createdAt'];

  @Column('varchar', { length: 26 })
  commentId!: ICommentSnapshot['commentId'];

  @ManyToOne(() => CommentEntity, (comment) => comment.snapshots)
  @JoinColumn({ name: 'commentId' })
  comment!: CommentEntity;
}
