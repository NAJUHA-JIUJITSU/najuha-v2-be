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
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPostSnapshotImage['id'];

  @Column('uuid')
  postSnapshotId!: IPostSnapshotImage['postSnapshotId'];

  @Column('uuid')
  imageId!: IPostSnapshotImage['imageId'];

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
