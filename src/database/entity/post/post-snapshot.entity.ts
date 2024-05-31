import { IPostSnapshot } from 'src/modules/posts/domain/interface/post-snapshot.interface';
import { Entity, Column, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { PostEntity } from './post.entity';

/**
 * PostSnapshot.
 *
 * 게시글의 스냅샷 정보를 담는 Entity입니다.
 * `post`에서 언급한 것처럼 증거를 보관하고 사기를 방지하기 위해 게시글 레코드에서 게시글 내용을 분리하여 보관합니다.
 *
 * @namespace Post
 */
@Entity('post_snapshot')
export class PostSnapshotEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPostSnapshot['id'];

  /** 게시글 제목. */
  @Column('varchar', { length: 64 })
  title!: IPostSnapshot['title'];

  /** 게시글 내용. */
  @Column('text')
  body!: IPostSnapshot['body'];

  /** 게시글 작성일자. */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPostSnapshot['createdAt'];

  /** 게시글 Id. */
  @Column('uuid')
  postId!: IPostSnapshot['postId'];

  //------------------------------------------------------------
  // Relations
  //------------------------------------------------------------
  @ManyToOne(() => PostEntity, (post) => post.postSnapshots)
  @JoinColumn({ name: 'postId' })
  post!: PostEntity;
}
