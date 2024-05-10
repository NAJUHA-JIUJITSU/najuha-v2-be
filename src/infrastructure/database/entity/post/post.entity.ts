import { IPost } from 'src/modules/posts/domain/interface/post.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { ulid } from 'ulid';
import { PostSnapshotEntity } from './post-snapshot.entity';
import { PostLikeEntity } from './post-like.entity';
import { PostReportEntity } from './post-report.entity';
import { CommentEntity } from './comment.entity';

// --- Post Entity ---
@Entity('post')
export class PostEntity {
  @PrimaryColumn('varchar', { length: 26, default: ulid() })
  id!: IPost['id'];

  @Column('varchar', { length: 26 })
  userId!: IPost['userId'];

  @Column('int', { default: 0 })
  viewCount!: IPost['viewCount'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPost['createdAt'];

  @Column('timestamptz', { nullable: true })
  deletedAt!: IPost['deletedAt'];

  @OneToMany(() => PostSnapshotEntity, (postSnapshot) => postSnapshot.post, { cascade: true })
  snapshots!: PostSnapshotEntity[];

  @OneToMany(() => PostLikeEntity, (postLike) => postLike.post, { cascade: true })
  likes!: PostLikeEntity[];

  @OneToMany(() => PostReportEntity, (postReport) => postReport.post, { cascade: true })
  reports!: PostReportEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post, { cascade: true })
  comments!: CommentEntity[];
}
