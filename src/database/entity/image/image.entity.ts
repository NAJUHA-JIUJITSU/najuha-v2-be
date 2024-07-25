import { IImage } from '../../../modules/images/domain/interface/image.interface';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { uuidv7 } from 'uuidv7';
import { CompetitionPosterImageEntity } from '../competition/competition-poster-image.entity';
import { PostSnapshotImageEntity } from '../post/post-snapshot-image.entity';
import { UserProfileImageEntity } from '../user/user-profile-image.entity';

/**
 * Image.
 *
 * 이미지 정보.
 * - bucket에 저장되는 이미지 정보.
 * - UserImage, CompetitionPosterImage, PostImage 등 에 매핑되어 사용됩니다.
 * - 이미지는 10분 이후에도 UserImage, CompetitionPosterImage, PostImage 등 에 매핑되지 않으면 삭제됩니다.
 * - 이미지가 매핑된다면 linkedAt 에 매핑된 시간이 저장됩니다.
 *
 * @namespace Image
 * @erd Competition
 * @erd Post
 * @erd User
 */
@Entity('image')
export class ImageEntity {
  /**
   * UUID v7.
   * - s3 bucket에 저장되는 이미지의 key로 사용됩니다.
   * - `${bucketHost}/${bucketName}/${path}/${id}` 로 접근 가능합니다.
   * - ex) http://localhost:9000/najuha-v2-bucket/competition/019000fb-11c3-7766-ad55-17c0c2b18cae
   */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IImage['id'];

  /**
   * s3 bucket에 저장되는 이미지의 경로
   * - user 프로필 이미지를 생성하는 경우: `user-profile` 로 설로
   * - competition 이미지를 생성하는 경우: `competition` 로 설정
   * - post 이미지를 생성하는 경우: `post` 로 설정
   */
  @Column('varchar')
  path!: IImage['path'];

  /**
   * image format.
   * - 'image/jpeg'
   * - 'image/png'
   * - 'image/webp';
   */
  @Column('varchar')
  format!: IImage['format'];

  /**
   * createdAt.
   * - 이미지가 생성된 시간
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IImage['createdAt'];

  /**
   * linkedAt.
   * - 이미지를 소유한 entity에 FK로 연결된 시간.
   * - null 이면 연결되지 않은 이미지.
   * - createdAt + 10분 이후에도 연결되지 않은 이미지는 주기적으로 삭제됩니다.
   */
  @Column('timestamptz', { nullable: true })
  linkedAt!: IImage['linkedAt'];

  /**
   * userId.
   * - 이미지를 생성한 계정의 userId.
   */
  @Column('uuid')
  userId!: IImage['userId'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  @ManyToOne(() => UserEntity, (user) => user.images)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @OneToMany(() => CompetitionPosterImageEntity, (competitionPosterImage) => competitionPosterImage.image)
  competitionPosterImages!: CompetitionPosterImageEntity[];

  @OneToMany(() => PostSnapshotImageEntity, (postSnapshotImage) => postSnapshotImage.image)
  postSnapshotImages!: PostSnapshotImageEntity[];

  @OneToMany(() => UserProfileImageEntity, (userProfileImage) => userProfileImage.image)
  userProfileImages!: UserProfileImageEntity[];
}
