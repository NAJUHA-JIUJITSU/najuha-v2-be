import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { UserEntity } from '../user/user.entity';
import { ImageEntity } from '../image/image.entity';
import { IUserProfileImage } from '../../../modules/users/domain/interface/user-profile-image.interface';

/**
 * UserProfileImage.
 *
 * 사용자 프로필 이미지 정보.
 * - ImageEntity 와 UserEntity 를 연결하는 엔티티.
 * - 실제 이미지 정보는 ImageEntity 에 저장되어 있습니다.
 *
 * @namespace User
 * @erd Image
 */
@Entity('user_profile_image')
export class UserProfileImageEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IUserProfileImage['id'];

  /** userId */
  @Column('uuid')
  userId!: IUserProfileImage['userId'];

  /**
   * imageId
   * - u-9-1 createImage 로 생성된 image의 id
   */
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
