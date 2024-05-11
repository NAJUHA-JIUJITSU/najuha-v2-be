import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { DivisionEntity } from './division.entity';
import { EarlybirdDiscountSnapshotEntity } from './earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from './combination-discount-snapshot.entity';
import { ApplicationEntity } from '../application/application.entity';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { ulid } from 'ulid';
import { RequiredAdditionalInfoEntity } from './required-additional-info.entity';

@Entity('competition')
export class CompetitionEntity {
  @Column('varchar', { length: 26, primary: true, default: ulid() })
  id!: ICompetition['id'];

  @Column('varchar', { length: 256, default: 'DEFAULT TITLE' })
  title!: ICompetition['title'];

  @Column('varchar', { length: 256, default: 'DEFAULT ADDRESS' })
  address!: ICompetition['address'];

  @Column('timestamptz', { nullable: true })
  competitionDate!: ICompetition['competitionDate'];

  @Column('timestamptz', { nullable: true })
  registrationStartDate!: ICompetition['registrationStartDate'];

  @Column('timestamptz', { nullable: true })
  registrationEndDate!: ICompetition['registrationEndDate'];

  @Column('timestamptz', { nullable: true })
  refundDeadlineDate!: ICompetition['refundDeadlineDate'];

  @Column('timestamptz', { nullable: true })
  soloRegistrationAdjustmentStartDate!: ICompetition['soloRegistrationAdjustmentStartDate'];

  @Column('timestamptz', { nullable: true })
  soloRegistrationAdjustmentEndDate!: ICompetition['soloRegistrationAdjustmentEndDate'];

  @Column('timestamptz', { nullable: true })
  registrationListOpenDate!: ICompetition['registrationListOpenDate'];

  @Column('timestamptz', { nullable: true })
  bracketOpenDate!: ICompetition['bracketOpenDate'];

  @Column('text', { default: 'DEFAULT DESCRIPTION' })
  description!: ICompetition['description'];

  @Column('boolean', { default: false })
  isPartnership!: ICompetition['isPartnership'];

  @Column('int', { default: 0 })
  viewCount!: ICompetition['viewCount'];

  @Column('varchar', { length: 256, nullable: true })
  posterImgUrlKey!: ICompetition['posterImgUrlKey'];

  @Column('varchar', { length: 16, default: 'INACTIVE' })
  status!: ICompetition['status'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICompetition['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: ICompetition['updatedAt'];

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

  @OneToMany(() => ApplicationEntity, (application) => application.competition)
  applications!: ApplicationEntity[];
}
