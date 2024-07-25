import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index, PrimaryColumn } from 'typeorm';
import { DivisionEntity } from './division.entity';
import { EarlybirdDiscountSnapshotEntity } from './earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from './combination-discount-snapshot.entity';
import { ApplicationEntity } from '../application/application.entity';
import { ICompetition } from '../../../modules/competitions/domain/interface/competition.interface';
import { uuidv7 } from 'uuidv7';
import { RequiredAdditionalInfoEntity } from './required-additional-info.entity';
import { CompetitionHostMapEntity } from './competition-host.entity';
import { CompetitionPosterImageEntity } from './competition-poster-image.entity';

/**
 * Competition.
 *
 * 대회 정보.
 * @namespace Competition
 */
@Entity('competition')
@Index('IDX_Competition_competitionDate', ['competitionDate'])
@Index('IDX_Competition_status', ['status'])
export class CompetitionEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: ICompetition['id'];

  /**
   * 대회 결제 ID.
   * - 결제 ID는 26자리 ULID 형식입니다.
   * - 각 대회마다 고유한 결제 ID를 가집니다.
   * - 해당 대회신청을 결제할때 필요한 orderId에 포함됩니다. `${orderId}_${competitionPaymentId}` (63자)
   * - tosspayments에서 해당 대회의 결제 정보를 조회할때 사용됩니다.
   */
  @Column('varchar', { length: 26, unique: true })
  competitionPaymentId!: ICompetition['competitionPaymentId'];

  /** 대회명. */
  @Column('varchar', { length: 256, default: 'DEFAULT TITLE' })
  title!: ICompetition['title'];

  /** 대회가 열리는 위치 (도로명 주소).*/
  @Column('varchar', { length: 256, default: 'DEFAULT ADDRESS' })
  address!: ICompetition['address'];

  /** 대회 날짜. */
  @Column('timestamptz', { nullable: true })
  competitionDate!: ICompetition['competitionDate'];

  /** 참가 신청 시작일.  */
  @Column('timestamptz', { nullable: true })
  registrationStartDate!: ICompetition['registrationStartDate'];

  /** 참가 신청 마감일. */
  @Column('timestamptz', { nullable: true })
  registrationEndDate!: ICompetition['registrationEndDate'];

  /** 환불 가능 기간 마감일. */
  @Column('timestamptz', { nullable: true })
  refundDeadlineDate!: ICompetition['refundDeadlineDate'];

  /**
   * 단독 참가자의 부문 조정 시작일.
   * - 부문에 참가자가 한 명만 있는 경우, 해당 참가자를 다른 체급이나 부문으로 조정할 수 있는 기간의 시작을 나타냅니다.
   */
  @Column('timestamptz', { nullable: true })
  soloRegistrationAdjustmentStartDate!: ICompetition['soloRegistrationAdjustmentStartDate'];

  /** 단독 참가자의 부문 조정 마감일. */
  @Column('timestamptz', { nullable: true })
  soloRegistrationAdjustmentEndDate!: ICompetition['soloRegistrationAdjustmentEndDate'];

  /** 참가자 명단 공개일. */
  @Column('timestamptz', { nullable: true })
  registrationListOpenDate!: ICompetition['registrationListOpenDate'];

  /** 대진표 공개일. */
  @Column('timestamptz', { nullable: true })
  bracketOpenDate!: ICompetition['bracketOpenDate'];

  /** 대회 상세 정보. */
  @Column('text', { default: 'DEFAULT DESCRIPTION' })
  description!: ICompetition['description'];

  /** 협약 대회 여부. */
  @Column('boolean', { default: false })
  isPartnership!: ICompetition['isPartnership'];

  /** 조회수. */
  @Column('int', { default: 0 })
  viewCount!: ICompetition['viewCount'];

  /**
   * 대회의 상태.
   * - ACTIVE: 활성화된 대회 유저에게 노출, 참가 신청 가능.
   * - INACTIVE: 비활성화된 대회 유저에게 노출되지 않음, 참가 신청 불가능.
   */
  @Column('varchar', { length: 16, default: 'INACTIVE' })
  status!: ICompetition['status'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICompetition['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: ICompetition['updatedAt'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  @OneToMany(() => DivisionEntity, (division) => division.competition, { cascade: true })
  divisions!: DivisionEntity[];

  @OneToMany(
    () => EarlybirdDiscountSnapshotEntity,
    (earlyBirdDiscountSnapshot) => earlyBirdDiscountSnapshot.competition,
    { cascade: true },
  )
  earlybirdDiscountSnapshots!: EarlybirdDiscountSnapshotEntity[];

  @OneToMany(
    () => CombinationDiscountSnapshotEntity,
    (combinationDiscountSnapshot) => combinationDiscountSnapshot.competition,
    { cascade: true },
  )
  combinationDiscountSnapshots!: CombinationDiscountSnapshotEntity[];

  @OneToMany(() => RequiredAdditionalInfoEntity, (requiredAdditionalInfo) => requiredAdditionalInfo.competition, {
    cascade: true,
  })
  requiredAdditionalInfos!: RequiredAdditionalInfoEntity[];

  @OneToMany(() => CompetitionHostMapEntity, (competitionHost) => competitionHost.competition, {
    cascade: true,
  })
  competitionHostMaps!: CompetitionHostMapEntity[];

  @OneToMany(() => ApplicationEntity, (application) => application.competition)
  applications!: ApplicationEntity[];

  @OneToMany(() => CompetitionPosterImageEntity, (competitionPosterImage) => competitionPosterImage.competition, {
    cascade: true,
  })
  competitionPosterImages!: CompetitionPosterImageEntity[];
}
