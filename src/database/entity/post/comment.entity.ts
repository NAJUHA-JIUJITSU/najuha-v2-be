import { IComment } from '../../../modules/posts/domain/interface/comment.interface';
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
import { PostEntity } from './post.entity';
import { CommentReportEntity } from './comment-report.entity';
import { CommentLikeEntity } from './comment-like.entity';
import { CommentSnapshotEntity } from './comment-snapshot.entity';
import { UserEntity } from '../user/user.entity';
import { uuidv7 } from 'uuidv7';

/**
 * Comment, CommentRpely.
 * 댓글 or 대댓글을 식별하는 최상위 엔티티로서 개별 댓글의 메타데이터를 담고 있습니다.
 *
 * 댓글의 내용(body) `comment`에 존재하지 않고, `comment_snapshot`에 저장되어 있습니다.
 * `comment`와 `comment_snapshot`는 1:N 관계로 연결되어 있는데, 이는 댓글이 수정될때마다 새로운 스냅샷 레코드가 생성되기 때문입니다.
 *
 * 댓글이 수정될때마다 새로운 스냅샷 레코드가 생성되는 이유는 증거를 보존 및 추적하기 위함입니다. 온라인 커뮤니티의 특성상 참여자 간에는 항상 분쟁의 위험이 존재합니다.
 * 그리고 분쟁은 글이나 댓글을 통해 발생할 수 있으며, 기존 댓글을 수정하여 상황을 조작하는 등의 행위를 방지하기 위해 이러한 구조로 설계되었습니다. 즉, 증거를 보관하고 사기를 방지하기 위한 것입니다.
 *
 * 대댓글은 부모 댓글의 `id`를 `parentId`에 저장하여 관계를 맺습니다. 대댓글의 depth는 1로 제한되어 있습니다. 즉 대댓글의 대댓글은 생성할 수 없습니다.
 *
 * @namespace Post
 */
@Entity('comment')
export class CommentEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IComment['id'];

  /** 댓글 작성자 UserId. */
  @Column('uuid')
  userId!: IComment['userId'];

  /**
   * 부모 댓글 Id.
   * - 댓글의 경우 `null`을 저장합니다.
   * - 대댓글의 경우 부모 댓글의 `id`를 저장합니다.
   */
  @Column('uuid', { nullable: true })
  parentId!: IComment['parentId'] | null;

  /**
   * 댓글 상태. default: `ACTIVE`.
   * - `ACTIVE`: 유저에게 노출.
   * - `INACTIVE`: 유저에게 노출되지 않음.
   * 관리자의 판단 하에 `INACTIVE`로 변경될 수 있습니다.
   * 신고 회수가 10회 이상이면 자동으로 `INACTIVE` 처리됩니다. 관리자의 판단 하에 `ACTIVE`로 변경될 수 있습니다.
   */
  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status!: IComment['status'];

  /** 댓글 작성일자. */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IComment['createdAt'];

  /** 댓글 삭제일자. */
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: IComment['deletedAt'];

  /** 게시글 Id. */
  @Column('uuid')
  postId!: IComment['postId'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  /**
   * 댓글 스냅샷.
   * @minitems 1
   */
  @OneToMany(() => CommentSnapshotEntity, (snapshot) => snapshot.comment, { cascade: true })
  commentSnapshots!: CommentSnapshotEntity[];

  /** 대댓글 목록. */
  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  replies!: CommentEntity[];

  /**
   * 댓글 좋아요 목록.
   */
  @OneToMany(() => CommentLikeEntity, (like) => like.comment)
  likes!: CommentLikeEntity[];

  /** 부모 댓글. */
  @ManyToOne(() => CommentEntity, (comment) => comment.replies)
  @JoinColumn({ name: 'parentId' })
  parent!: CommentEntity;

  /** 댓글 신고 목록. */
  @OneToMany(() => CommentReportEntity, (report) => report.comment, { cascade: true })
  reports!: CommentReportEntity[];

  /** 게시글. */
  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post!: PostEntity;

  /** 댓글 작성자. */
  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
