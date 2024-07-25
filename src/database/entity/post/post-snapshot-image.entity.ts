import { IPostSnapshotImage } from '../../../modules/posts/domain/interface/post-snapshot-image.interface';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { PostSnapshotEntity } from './post-snapshot.entity';
import { ImageEntity } from '../image/image.entity';

/**
 * PostSnapshotImage.
 *
 * @namespace Post
 */
@Entity('post_snapshot_image')
export class PostSnapshotImageEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPostSnapshotImage['id'];

  /** postSnapshotId. */
  @Column('uuid')
  postSnapshotId!: IPostSnapshotImage['postSnapshotId'];

  /**
   * imageId.
   * - u-9-1 createImage 로 생성된 image의 id
   */
  @Column('uuid')
  imageId!: IPostSnapshotImage['imageId'];

  /**
   * sequence.
   * - 게시물 이미지의 순서.
   * - 0부터 시작.
   */
  @Column('int')
  sequence!: IPostSnapshotImage['sequence'];

  @Column('timestamptz')
  createdAt!: IPostSnapshotImage['createdAt'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  @ManyToOne(() => PostSnapshotEntity, (postSnapshot) => postSnapshot.postSnapshotImages)
  @JoinColumn({ name: 'postSnapshotId' })
  postSnapshot!: PostSnapshotEntity;

  @ManyToOne(() => ImageEntity, (image) => image.postSnapshotImages)
  @JoinColumn({ name: 'imageId' })
  image!: ImageEntity;
}
