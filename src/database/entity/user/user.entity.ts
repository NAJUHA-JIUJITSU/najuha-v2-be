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
 * User Entity
 * @namespace User
 */
@Entity('user')
export class UserEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IUser['id'];

  @Column('varchar', { length: 16, default: 'TEMPORARY_USER' })
  role!: IUser['role'];

  @Column('varchar', { length: 16 })
  snsAuthProvider!: IUser['snsAuthProvider'];

  @Column('varchar', { length: 256 })
  snsId!: IUser['snsId'];

  @Column('varchar', { length: 320 })
  email!: IUser['email'];

  @Column('varchar', { length: 256 })
  name!: IUser['name'];

  @Column('varchar', { length: 16 })
  phoneNumber!: IUser['phoneNumber'];

  @Column('varchar', { length: 64, unique: true })
  nickname!: IUser['nickname'];

  @Column('varchar', { length: 16 })
  gender!: IUser['gender'];

  @Column('varchar', { length: 8 })
  birth!: IUser['birth'];

  @Column('varchar', { length: 16 })
  belt!: IUser['belt'];

  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status!: IUser['status'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IUser['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: IUser['updatedAt'];

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
