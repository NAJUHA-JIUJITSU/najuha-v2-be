import { IPostLike } from 'src/modules/posts/domain/interface/post-like.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ulid } from 'ulid';
import { PostEntity } from './post.entity';

// --- Post Like Entity ---
@Entity('post_like')
@Unique('UQ_POST_LIKE', ['postId', 'userId'])
export class PostLikeEntity {
  @PrimaryColumn('varchar', { length: 26, default: ulid() })
  id!: IPostLike['id'];

  @Column('varchar', { length: 26 })
  userId!: IPostLike['userId'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPostLike['createdAt'];

  @Column('varchar', { length: 26 })
  postId!: IPostLike['postId'];

  @ManyToOne(() => PostEntity, (post) => post.likes)
  @JoinColumn({ name: 'postId' })
  post!: PostEntity;
}
