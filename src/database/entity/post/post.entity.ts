import { IPost } from '../../../modules/posts/domain/interface/post.interface';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PostSnapshotEntity } from './post-snapshot.entity';
import { PostLikeEntity } from './post-like.entity';
import { PostReportEntity } from './post-report.entity';
import { CommentEntity } from './comment.entity';
import { uuidv7 } from 'uuidv7';
import { UserEntity } from '../user/user.entity';

/**
 * Post.
 * 게시글을 식별하는 최상위 엔티티로서 개별 게시글의 메타데이터를 담고 있습니다.
 *
 * 게시글의 필수 요소 `title`, `body` 등은 `post`에 존재하지 않고, `post_snapshot`에 저장되어 있습니다.
 * `post`와 `post_snapshot`는 1:N 관계로 연결되어 있는데, 이는 글이 수정될때마다 새로운 스냅샷 레코드가 생성되기 때문입니다.
 *
 * 게시글이 수정될때마다 새로운 스냅샷 레코드가 생성되는 이유는 증거를 보존 및 추적하기 위함입니다. 온라인 커뮤니티의 특성상 참여자 간에는 항상 분쟁의 위험이 존재합니다.
 * 그리고 분쟁은 글이나 댓글을 통해 발생할 수 있으며, 기존 글을 수정하여 상황을 조작하는 등의 행위를 방지하기 위해 이러한 구조로 설계되었습니다. 즉, 증거를 보관하고 사기를 방지하기 위한 것입니다.
 *
 * @namespace Post
 */
@Entity('post')
export class PostEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPost['id'];

  /** 게시글 작성자 UserId. */
  @Column('uuid')
  userId!: IPost['userId'];

  /** 게시글 조회수. */
  @Column('int', { default: 0 })
  viewCount!: IPost['viewCount'];

  /**
   * 게시글 상태. default: `ACTIVE`.
   * - `ACTIVE`: 유저에게 노출.
   * - `INACTIVE`: 유저에게 노출되지 않음.
   * 관리자의 판단 하에 `INACTIVE`로 변경될 수 있습니다.
   * 신고 회수가 10회 이상이면 자동으로 `INACTIVE` 처리됩니다. 관리자의 판단 하에 `ACTIVE`로 변경될 수 있습니다.
   */
  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status!: IPost['status'];

  /**
   * Post category.
   * - FREE: 자유 게시판.
   * - COMPETITION: 대회 게시판.
   * - SEMINAR: 세미나 게시판.
   * - OPEN_MAT: 오픈 매트 게시판.
   */
  @Column('varchar', { length: 32, default: 'FREE' })
  category!: IPost['category'];

  /** 게시글 작성일자. */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPost['createdAt'];

  /** 게시글 삭제일자. */
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: IPost['deletedAt'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  /**
   * 게시글 스냅샷. 게시글이 수정될때마다 새로운 스냅샷 레코드가 생성됩니다.
   * @minitems 1
   */
  @OneToMany(() => PostSnapshotEntity, (snapshot) => snapshot.post, { cascade: true })
  postSnapshots!: PostSnapshotEntity[];

  /** 게시글 좋아요 목록. */
  @OneToMany(() => PostLikeEntity, (like) => like.post)
  likes!: PostLikeEntity[];

  /** 게시글 신고 목록. */
  @OneToMany(() => PostReportEntity, (report) => report.post)
  reports!: PostReportEntity[];

  /** 게시글 댓글 목록. */
  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments!: CommentEntity[];

  /** 게시글 작성자. */
  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
