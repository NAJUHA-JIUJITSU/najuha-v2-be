import { IImage } from 'src/modules/images/domain/interface/image.interface';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { UserEntity } from '../user/user.entity';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { ImageEntity } from '../image/image.entity';

/**
 * UserProfileImage Entity
 * @namespace Image
 */
@Entity('user_profile_image')
export class UserProfileImageSnapshotEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IImage['id'];

  @Column('uuid')
  userId!: IUser['id'];

  @Column('uuid')
  imageId!: IImage['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IImage['createdAt'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  @OneToOne(() => UserEntity, (user) => user.profileImageSnapshots)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @ManyToOne(() => ImageEntity, (image) => image.userProfileImageSnapshots)
  @JoinColumn({ name: 'imageId' })
  image!: ImageEntity;
}
