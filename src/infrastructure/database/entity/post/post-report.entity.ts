import { IPostReport } from 'src/modules/posts/domain/interface/post-report.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ulid } from 'ulid';
import { PostEntity } from './post.entity';

// --- Post Report Entity ---
@Entity('post_report')
@Unique('UQ_POST_REPORT', ['postId', 'userId'])
export class PostReportEntity {
  @PrimaryColumn('varchar', { length: 26, default: ulid() })
  id!: IPostReport['id'];

  @Column('varchar', { length: 26 })
  userId!: IPostReport['userId'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPostReport['createdAt'];

  @Column('varchar', { length: 26 })
  postId!: IPostReport['postId'];

  @ManyToOne(() => PostEntity, (post) => post.reports)
  @JoinColumn({ name: 'postId' })
  post!: PostEntity;
}
