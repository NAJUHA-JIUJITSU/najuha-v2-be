import { ICommentReport } from 'src/modules/posts/domain/interface/comment-report.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ulid } from 'ulid';
import { CommentEntity } from './comment.entity';

// --- Comment Report Entity ---
@Entity('comment_report')
@Unique('UQ_COMMENT_REPORT', ['commentId', 'userId'])
export class CommentReportEntity {
  @PrimaryColumn('varchar', { length: 26, default: ulid() })
  id!: ICommentReport['id'];

  @Column('varchar', { length: 26 })
  userId!: ICommentReport['userId'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICommentReport['createdAt'];

  @Column('varchar', { length: 26 })
  commentId!: ICommentReport['commentId'];

  @ManyToOne(() => CommentEntity, (comment) => comment.reports)
  @JoinColumn({ name: 'commentId' })
  comment!: CommentEntity;
}
