import { IImage } from 'src/modules/images/domain/interface/image.interface';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { UserProfileImageEntity } from '../user/user-profile-image.entity';
import { uuidv7 } from 'uuidv7';

/**
 * Image Entity
 * @namespace Image
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

  @OneToMany(() => UserProfileImageEntity, (userProfileImageSnapshot) => userProfileImageSnapshot.image)
  userProfileImageSnapshots!: UserProfileImageEntity[];
}
