import { PolicyConsentEntity } from './policy-consent.entity';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { IUser } from '../../../modules/users/domain/interface/user.interface';
import { uuidv7 } from 'uuidv7';
import { CompetitionHostMapEntity } from '../competition/competition-host.entity';
import { CommentLikeEntity } from '../post/comment-like.entity';
import { CommentEntity } from '../post/comment.entity';
import { CommentReportEntity } from '../post/comment-report.entity';
import { PostLikeEntity } from '../post/post-like.entity';
import { PostReportEntity } from '../post/post-report.entity';
import { PostEntity } from '../post/post.entity';
import { ImageEntity } from '../image/image.entity';
import { UserProfileImageEntity } from './user-profile-image.entity';

/**
 * User.
 *
 * 사용자 정보.
 * @namespace User
 */
@Entity('user')
export class UserEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IUser['id'];

  /**
   * User 역할. User의 접근 권한을 나타냅니다.
   * - ADMIN: 관리자 권한.
   * - HOST: 대회 주최자 권한.
   * - USER: 일반 User 권한.
   * - TEMPORARY_USER: 회원가입을 완료하지 않은 User 권한.
   */
  @Column('varchar', { length: 16, default: 'TEMPORARY_USER' })
  role!: IUser['role'];

  /**
   * SNS 공급자. User가 로그인하는데 사용한 SNS 플랫폼을 나타냅니다.
   * - KAKAO: 카카오.
   * - NAVER: 네이버.
   * - GOOGLE: 구글.
   * - APPLE: 애플.
   */
  @Column('varchar', { length: 16 })
  snsAuthProvider!: IUser['snsAuthProvider'];

  /** SNS ID. 소셜 로그인을 위한 고유 식별자입니다. */
  @Column('varchar', { length: 256 })
  snsId!: IUser['snsId'];

  /** User 이메일 주소. */
  @Column('varchar', { length: 320 })
  email!: IUser['email'];

  /**
   * User 이름.
   * - 컬럼길이는 256으로 설정하였으나, 입력값 유효성검사는 64자 이내로 설정하도록 합니다.
   * - User 이름은 한글, 영문, 숫자만 입력 가능합니다.
   */
  @Column('varchar', { length: 256 })
  name!: IUser['name'];

  /**
   * User 전화번호.
   * - 전화번호가 저장되어 있으면 인증된 전화번호 입니다.
   * - ex) 01012345678.
   */
  @Column('varchar', { length: 16 })
  phoneNumber!: IUser['phoneNumber'];

  /**
   * User 별명.
   * - 영문, 한글, 숫자만 입력 가능합니다. */
  @Column('varchar', { length: 64, unique: true })
  nickname!: IUser['nickname'];

  /** User 성별. */
  @Column('varchar', { length: 16 })
  gender!: IUser['gender'];

  /** User 생년월일 (BirtDate YYYYMMDD). */
  @Column('varchar', { length: 8 })
  birth!: IUser['birth'];

  /** User 주짓수 벨트. */
  @Column('varchar', { length: 16 })
  belt!: IUser['belt'];

  /**
   * User 상태.
   * - ACTIVE: 활성.
   * - INACTIVE: 비활성.
   */
  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status!: IUser['status'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IUser['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: IUser['updatedAt'];

  // -----------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------

  // PolicyConsent ---------------------------------------------------------
  @OneToMany(() => PolicyConsentEntity, (policyConsent) => policyConsent.user, { cascade: true })
  policyConsents!: PolicyConsentEntity[];

  // Application -----------------------------------------------------------
  @OneToMany(() => ApplicationEntity, (application) => application.user)
  applications!: ApplicationEntity[];

  // Competition -----------------------------------------------------------
  @OneToMany(() => CompetitionHostMapEntity, (competitionHost) => competitionHost.user)
  competitionHostMaps!: CompetitionHostMapEntity[];

  // Community --------------------------------------------------------------
  @OneToMany(() => CommentLikeEntity, (commentLike) => commentLike.user)
  commentLikes!: CommentLikeEntity[];

  @OneToMany(() => CommentReportEntity, (commentReport) => commentReport.user)
  commentReports!: CommentReportEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments!: CommentEntity[];

  @OneToMany(() => PostLikeEntity, (postLike) => postLike.user)
  postLikes!: PostLikeEntity[];

  @OneToMany(() => PostReportEntity, (postReport) => postReport.user)
  postReports!: PostReportEntity[];

  @OneToMany(() => PostEntity, (post) => post.user)
  posts!: PostEntity[];

  // Image -----------------------------------------------------------------
  @OneToMany(() => ImageEntity, (image) => image.user)
  images!: ImageEntity[];

  @OneToMany(() => UserProfileImageEntity, (profileImage) => profileImage.user, { cascade: true })
  profileImages!: UserProfileImageEntity[];
}
