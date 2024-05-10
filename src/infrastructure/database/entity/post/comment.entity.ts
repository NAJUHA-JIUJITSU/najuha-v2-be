import { IComment } from 'src/modules/posts/domain/interface/comment.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ulid } from 'ulid';
import { PostEntity } from './post.entity';
import { CommentReportEntity } from './comment-report.entity';
import { CommentLikeEntity } from './comment-like.entity';
import { CommentSnapshotEntity } from './comment-snapshot.entity';

// --- Comment Entity ---
@Entity('comment')
export class CommentEntity {
  @PrimaryColumn('varchar', { length: 26, default: ulid() })
  id!: IComment['id'];

  @Column('varchar', { length: 26 })
  userId!: IComment['userId'];

  @Column('varchar', { length: 26, nullable: true })
  parentId!: IComment['parentId'] | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IComment['createdAt'];

  @Column('timestamptz', { nullable: true })
  deletedAt!: IComment['deletedAt'];

  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post!: PostEntity;

  @OneToMany(() => CommentSnapshotEntity, (snapshot) => snapshot.comment, { cascade: true })
  snapshots!: CommentSnapshotEntity[];

  @OneToMany(() => CommentLikeEntity, (like) => like.comment, { cascade: true })
  likes!: CommentLikeEntity[];

  @OneToMany(() => CommentReportEntity, (report) => report.comment, { cascade: true })
  reports!: CommentReportEntity[];
}
