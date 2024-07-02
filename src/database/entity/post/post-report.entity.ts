import { IPostReport } from '../../../modules/posts/domain/interface/post-report.interface';
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
 * @namespace Post
 */
@Entity('post_report')
@Unique('UQ_POST_REPORT', ['postId', 'userId'])
export class PostReportEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPostReport['id'];

  /**
   * 신고 타입.
   * - SPAM_CLICKBAIT: 낚시 / 놀람 / 도배
   * - COMMERCIAL_ADVERTISING: 상업적 광고 및 판매
   * - SEXUAL_CONTENT: 음란성 / 선정적
   * - ABUSE_HARASSMENT: 욕설/비하
   * - POLITICAL_DISPARAGEMENT: 정당/정치인 비하 및 선거운동
   * - IMPERSONATION_FRAUD: 유출/사칭/사기
   * - ILLEGAL_DISTRIBUTION: 불법촬영물 등의 유통
   * - RELIGIOUS_PROSELYTIZING: 종교 포교 시도
   * - INAPPROPRIATE_CONTENT: 게시판 성격에 부적절함
   */
  @Column('varchar', { length: 64 })
  type!: IPostReport['type'];

  /**
   * 신고 상태.
   * `ACCEPTED`상태의 신고가 10회 이상이면 해당 게시글이 `INACTIVE` 상태로 변경됩니다.
   * - `ACCEPTED`: 신고 승인.
   * - `REJECTED`: 신고 거부.
   */
  @Column('varchar', { length: 16, default: 'ACCEPTED' })
  status!: IPostReport['status'];

  /** 신고자 UserId. */
  @Column('uuid')
  userId!: IPostReport['userId'];

  /** 신고된 게시글의 Id. */
  @Column('uuid')
  postId!: IPostReport['postId'];

  /** 신고일자. */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPostReport['createdAt'];

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
