import { IPostSnapshot } from 'src/modules/posts/domain/interface/post-snapshot.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, OneToMany, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ulid } from 'ulid';
import { PostEntity } from './post.entity';

// --- Post Snapshot Entity ---
@Entity('post_snapshot')
export class PostSnapshotEntity {
  @PrimaryColumn('varchar', { length: 26, default: ulid() })
  id!: IPostSnapshot['id'];

  @Column('varchar', { length: 64 })
  title!: IPostSnapshot['title'];

  @Column('text')
  body!: IPostSnapshot['body'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPostSnapshot['createdAt'];

  @Column('varchar', { length: 26 })
  postId!: IPostSnapshot['postId'];

  @ManyToOne(() => PostEntity, (post) => post.snapshots)
  @JoinColumn({ name: 'postId' })
  post!: PostEntity;
}
