import { ICommentReport } from 'src/modules/posts/domain/interface/comment-report.interface';
import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { CommentEntity } from './comment.entity';
import { UserEntity } from '../user/user.entity';

/**
 * CommentReport.
 *
 * 댓글의 신고정보를 담는 Entity입니다.
 * 신고 횟수가 10회 이상이면 해당 댓글이 `INACTIVE` 상태로 변경되고, 유저에게 노출되지 않습니다.
 * 동일한 유저가 동일한 댓글을 여러 번 신고할 수 없습니다. (중복신고 불가능)
 *
 * @namespace Community
 */
@Entity('comment_report')
@Unique('UQ_COMMENT_REPORT', ['commentId', 'userId'])
export class CommentReportEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: ICommentReport['id'];

  /** 신고자 UserId. */
  @Column('uuid')
  userId!: ICommentReport['userId'];

  /** 신고일자. */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICommentReport['createdAt'];

  /** 신고된 댓글의 Id. */
  @Column('uuid')
  commentId!: ICommentReport['commentId'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  @ManyToOne(() => CommentEntity, (comment) => comment.reports)
  @JoinColumn({ name: 'commentId' })
  comment!: CommentEntity;

  @ManyToOne(() => UserEntity, (user) => user.commentReports)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
