import { IImage } from '../../../modules/images/domain/interface/image.interface';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { uuidv7 } from 'uuidv7';
import { CompetitionPosterImageEntity } from '../competition/competition-poster-image.entity';
import { PostSnapshotImageEntity } from '../post/post-snapshot-image.entity';

/**
 * Image Entity
 * @namespace Image
 * @erd Competition
 * @erd Post
 */
@Entity('image')
export class ImageEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IImage['id'];

  @Column('varchar')
  path!: IImage['path'];

  @Column('varchar')
  format!: IImage['format'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IImage['createdAt'];

  @Column('timestamptz', { nullable: true })
  linkedAt!: IImage['linkedAt'];

  @Column('uuid')
  userId!: IImage['userId'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  @ManyToOne(() => UserEntity, (user) => user.images)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @OneToMany(() => CompetitionPosterImageEntity, (competitionPosterImage) => competitionPosterImage.image)
  competitionProfileImages!: CompetitionPosterImageEntity[];

  @OneToMany(() => PostSnapshotImageEntity, (postSnapshotImage) => postSnapshotImage.image)
  postSnapshotImages!: PostSnapshotImageEntity[];
}
