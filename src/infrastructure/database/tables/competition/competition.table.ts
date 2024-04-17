import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { DivisionTable } from './division.table';
import { EarlybirdDiscountSnapshotTable } from './earlybird-discount-snapshot.table';
import { CombinationDiscountSnapshotTable } from './combination-discount-snapshot.table';
import { ApplicationTable } from '../application/application.table';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';

@Entity('competition')
export class CompetitionTable {
  @Column('varchar', { length: 26, primary: true })
  id: ICompetition['id'];

  @Column('varchar', { length: 256, default: 'DEFAULT TITLE' })
  title: ICompetition['title'];

  @Column('varchar', { length: 256, default: 'DEFAULT ADDRESS' })
  address: ICompetition['address'];

  @Column('timestamptz', { nullable: true })
  competitionDate: ICompetition['competitionDate'];

  @Column('timestamptz', { nullable: true })
  registrationStartDate: ICompetition['registrationStartDate'];

  @Column('timestamptz', { nullable: true })
  registrationEndDate: ICompetition['registrationEndDate'];

  @Column('timestamptz', { nullable: true })
  refundDeadlineDate: ICompetition['refundDeadlineDate'];

  @Column('timestamptz', { nullable: true })
  soloRegistrationAdjustmentStartDate: ICompetition['soloRegistrationAdjustmentStartDate'];

  @Column('timestamptz', { nullable: true })
  soloRegistrationAdjustmentEndDate: ICompetition['soloRegistrationAdjustmentEndDate'];

  @Column('timestamptz', { nullable: true })
  registrationListOpenDate: ICompetition['registrationListOpenDate'];

  @Column('timestamptz', { nullable: true })
  bracketOpenDate: ICompetition['bracketOpenDate'];

  @Column('text', { default: 'DEFAULT DESCRIPTION' })
  description: ICompetition['description'];

  @Column('boolean', { default: false })
  isPartnership: ICompetition['isPartnership'];

  @Column('int', { default: 0 })
  viewCount: ICompetition['viewCount'];

  @Column('varchar', { length: 256, nullable: true })
  posterImgUrlKey: ICompetition['posterImgUrlKey'];

  @Column('varchar', { length: 16, default: 'INACTIVE' })
  status: ICompetition['status'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: ICompetition['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: ICompetition['updatedAt'];

  @OneToMany(() => EarlybirdDiscountSnapshotTable, (earlyBirdDiscountSnapshot) => earlyBirdDiscountSnapshot.competition)
  earlybirdDiscountSnapshots: EarlybirdDiscountSnapshotTable[];

  @OneToMany(
    () => CombinationDiscountSnapshotTable,
    (combinationDiscountSnapshot) => combinationDiscountSnapshot.competition,
  )
  combinationDiscountSnapshots: CombinationDiscountSnapshotTable[];

  @OneToMany(() => DivisionTable, (division) => division.competition, { cascade: true })
  divisions: DivisionTable[];

  @OneToMany(() => ApplicationTable, (application) => application.competition)
  applications: ApplicationTable[];
}
