import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { UserEntity } from '../user/user.entity';
import { ImageEntity } from '../image/image.entity';
import { IUserProfileImage } from '../../../modules/users/domain/interface/user-profile-image.interface';

/**
 * UserProfileImage Entity
 * @namespace User
 * @erd Image
 */
@Entity('user_profile_image')
export class UserProfileImageEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IUserProfileImage['id'];

  @Column('uuid')
  userId!: IUserProfileImage['userId'];

  @Column('uuid')
  imageId!: IUserProfileImage['imageId'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IUserProfileImage['createdAt'];

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: IUserProfileImage['deletedAt'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  @ManyToOne(() => UserEntity, (user) => user.profileImages)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @ManyToOne(() => ImageEntity, (image) => image.userProfileImages)
  @JoinColumn({ name: 'imageId' })
  image!: ImageEntity;
}
