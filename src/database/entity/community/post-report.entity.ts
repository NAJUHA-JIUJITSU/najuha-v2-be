import { IPostReport } from 'src/modules/posts/domain/interface/post-report.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { PostEntity } from './post.entity';
import { UserEntity } from '../user/user.entity';

/**
 * PostReport.
 *
 * 게시글의 신고정보를 담는 Entity입니다.
 * 신고 횟수가 10회 이상이면 해당 게시글이 `INACTIVE` 상태로 변경되고, 유저에게 노출되지 않습니다.
 * 동일한 유저가 동일한 게시글을 여러 번 신고할 수 없습니다. (중복신고 불가능)
 *
 * @namespace Community
 */
@Entity('post_report')
@Unique('UQ_POST_REPORT', ['postId', 'userId'])
export class PostReportEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPostReport['id'];

  /** 신고자 UserId. */
  @Column('uuid')
  userId!: IPostReport['userId'];

  /** 신고일자. */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPostReport['createdAt'];

  /** 신고된 게시글의 Id. */
  @Column('uuid')
  postId!: IPostReport['postId'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  @ManyToOne(() => PostEntity, (post) => post.reports)
  @JoinColumn({ name: 'postId' })
  post!: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.postReports)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
